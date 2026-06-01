#![cfg(test)]
extern crate std;

use super::*;
use soroban_sdk::testutils::Address as _;
use soroban_sdk::{token, Address, Env, String};

fn setup_env() -> (Env, MarketplaceContractClient<'static>, Address) {
    let env = Env::default();
    let admin = Address::generate(&env);
    let token_contract = env.register_stellar_asset_contract_v2(admin.clone());
    let token = token_contract.address();
    let contract_id = env.register(MarketplaceContract, ());
    let client = MarketplaceContractClient::new(&env, &contract_id);

    env.mock_all_auths();
    client.initialize(&token);

    (env, client, token)
}

fn mint_tokens(env: &Env, token: &Address, to: &Address, amount: i128) {
    let asset_client = token::StellarAssetClient::new(env, token);
    asset_client.mint(to, &amount);
}

#[test]
fn test_list_and_get_listings() {
    let (env, client, _token) = setup_env();
    let seller = Address::generate(&env);

    let id = client.list_item(
        &seller,
        &String::from_str(&env, "Weights"),
        &String::from_str(&env, "Llama-3 70B"),
        &String::from_str(&env, "Fine-tuned weights for finance"),
        &1_000_000_000,
    );
    assert_eq!(id, 1);

    let listings = client.get_listings();
    assert_eq!(listings.len(), 1);
    assert_eq!(
        listings.get(0).unwrap().title,
        String::from_str(&env, "Llama-3 70B")
    );
    assert_eq!(listings.get(0).unwrap().price, 1_000_000_000);
    assert!(listings.get(0).unwrap().active);
    assert_eq!(listings.get(0).unwrap().seller, seller);
}

#[test]
fn test_buy_item() {
    let (env, client, token) = setup_env();
    let seller = Address::generate(&env);
    let buyer = Address::generate(&env);

    let id = client.list_item(
        &seller,
        &String::from_str(&env, "Datasets"),
        &String::from_str(&env, "Crypto Sentiment Data"),
        &String::from_str(&env, "10M labeled tweets"),
        &500_000_000,
    );

    mint_tokens(&env, &token, &buyer, 1_000_000_000);
    mint_tokens(&env, &token, &seller, 1_000_000_000);

    let token_client = token::Client::new(&env, &token);
    assert_eq!(token_client.balance(&buyer), 1_000_000_000);
    assert_eq!(token_client.balance(&seller), 1_000_000_000);

    client.buy_item(&buyer, &id);

    let listing = client.get_listing(&id);
    assert!(!listing.active);

    let orders = client.get_orders(&id);
    assert_eq!(orders.len(), 1);
    assert_eq!(orders.get(0).unwrap().buyer, buyer);
    assert_eq!(orders.get(0).unwrap().seller, seller);
    assert_eq!(orders.get(0).unwrap().total, 500_000_000);

    assert_eq!(token_client.balance(&buyer), 500_000_000);
    assert_eq!(token_client.balance(&seller), 1_500_000_000);
}

#[test]
fn test_cancel_item() {
    let (env, client, _token) = setup_env();
    let seller = Address::generate(&env);

    let id = client.list_item(
        &seller,
        &String::from_str(&env, "Algorithms"),
        &String::from_str(&env, "ZK Prover"),
        &String::from_str(&env, "Optimized ZK prover"),
        &2_000_000_000,
    );

    client.cancel_item(&seller, &id);
    let listing = client.get_listing(&id);
    assert!(!listing.active);
}

#[test]
fn test_update_item() {
    let (env, client, _token) = setup_env();
    let seller = Address::generate(&env);

    let id = client.list_item(
        &seller,
        &String::from_str(&env, "Weights"),
        &String::from_str(&env, "Original Title"),
        &String::from_str(&env, "Original desc"),
        &100_000_000,
    );

    client.update_item(
        &seller,
        &id,
        &String::from_str(&env, "Notes"),
        &String::from_str(&env, "Updated Title"),
        &String::from_str(&env, "Updated description"),
        &200_000_000,
    );

    let listing = client.get_listing(&id);
    assert_eq!(listing.title, String::from_str(&env, "Updated Title"));
    assert_eq!(listing.price, 200_000_000);
}

#[test]
fn test_get_my_listings() {
    let (env, client, _token) = setup_env();
    let seller = Address::generate(&env);
    let other = Address::generate(&env);

    let _id1 = client.list_item(
        &seller,
        &String::from_str(&env, "Weights"),
        &String::from_str(&env, "My Weight"),
        &String::from_str(&env, "Desc"),
        &100_000_000,
    );

    let _id2 = client.list_item(
        &other,
        &String::from_str(&env, "Datasets"),
        &String::from_str(&env, "Other Dataset"),
        &String::from_str(&env, "Desc"),
        &200_000_000,
    );

    let mine = client.get_my_listings(&seller);
    assert_eq!(mine.len(), 1);
    assert_eq!(mine.get(0).unwrap().title, String::from_str(&env, "My Weight"));
}

#[test]
fn test_cannot_buy_own_listing() {
    let (env, client, token) = setup_env();
    let seller = Address::generate(&env);

    mint_tokens(&env, &token, &seller, 1_000_000_000);

    let id = client.list_item(
        &seller,
        &String::from_str(&env, "Weights"),
        &String::from_str(&env, "Test"),
        &String::from_str(&env, "Desc"),
        &100_000_000,
    );

    let result = std::panic::catch_unwind(std::panic::AssertUnwindSafe(|| {
        client.buy_item(&seller, &id);
    }));
    assert!(result.is_err());
}

#[test]
fn test_get_active_listings() {
    let (env, client, _token) = setup_env();
    let seller = Address::generate(&env);

    let id1 = client.list_item(
        &seller,
        &String::from_str(&env, "Weights"),
        &String::from_str(&env, "Active Item"),
        &String::from_str(&env, "Desc"),
        &100_000_000,
    );

    let id2 = client.list_item(
        &seller,
        &String::from_str(&env, "Datasets"),
        &String::from_str(&env, "Will be cancelled"),
        &String::from_str(&env, "Desc"),
        &200_000_000,
    );

    client.cancel_item(&seller, &id2);

    let active = client.get_active_listings();
    assert_eq!(active.len(), 1);
    assert_eq!(active.get(0).unwrap().id, id1);
}

#[test]
fn test_cannot_update_wrong_seller() {
    let (env, client, _token) = setup_env();
    let seller = Address::generate(&env);
    let imposter = Address::generate(&env);

    let id = client.list_item(
        &seller,
        &String::from_str(&env, "Weights"),
        &String::from_str(&env, "Mine"),
        &String::from_str(&env, "Desc"),
        &100_000_000,
    );

    let result = std::panic::catch_unwind(std::panic::AssertUnwindSafe(|| {
        client.update_item(
            &imposter,
            &id,
            &String::from_str(&env, "Algorithms"),
            &String::from_str(&env, "Hacked"),
            &String::from_str(&env, "Nope"),
            &1,
        );
    }));
    assert!(result.is_err());
}

#[test]
fn test_buy_inactive_listing_fails() {
    let (env, client, token) = setup_env();
    let seller = Address::generate(&env);
    let buyer = Address::generate(&env);

    let id = client.list_item(
        &seller,
        &String::from_str(&env, "Weights"),
        &String::from_str(&env, "Item"),
        &String::from_str(&env, "Desc"),
        &100_000_000,
    );

    mint_tokens(&env, &token, &buyer, 1_000_000_000);

    client.cancel_item(&seller, &id);

    let result = std::panic::catch_unwind(std::panic::AssertUnwindSafe(|| {
        client.buy_item(&buyer, &id);
    }));
    assert!(result.is_err());
}
