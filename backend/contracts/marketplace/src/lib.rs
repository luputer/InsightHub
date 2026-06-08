#![no_std]
use soroban_sdk::{contract, contractimpl, contracttype, token, Address, Env, String, Symbol, Vec, symbol_short};

#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct Listing {
    pub id: u64,
    pub seller: Address,
    pub category: String,
    pub title: String,
    pub description: String,
    pub file_link: String,
    pub price: i128,
    pub active: bool,
    pub created_at: u64,
}

#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct Order {
    pub id: u64,
    pub listing_id: u64,
    pub buyer: Address,
    pub seller: Address,
    pub total: i128,
    pub timestamp: u64,
}

const LISTINGS: Symbol = symbol_short!("LISTINGS");
const LST_CNTR: Symbol = symbol_short!("LST_CNTR");
const ORDERS: Symbol = symbol_short!("ORDERS");
const ORD_CNTR: Symbol = symbol_short!("ORD_CNTR");
const TOKEN: Symbol = symbol_short!("TOKEN");

#[contract]
pub struct MarketplaceContract;

#[contractimpl]
impl MarketplaceContract {
    pub fn initialize(env: Env, token: Address) {
        env.storage().instance().set(&TOKEN, &token);
    }

    fn check_initialized(env: &Env) {
        env.storage().instance().get::<_, Address>(&TOKEN)
            .expect("contract not initialized: call initialize(token_address) first");
    }

    pub fn list_item(
        env: Env,
        seller: Address,
        category: String,
        title: String,
        description: String,
        file_link: String,
        price: i128,
    ) -> u64 {
        Self::check_initialized(&env);
        seller.require_auth();

        let mut count: u64 = env.storage().instance().get(&LST_CNTR).unwrap_or(0);
        count += 1;

        let listing = Listing {
            id: count,
            seller: seller.clone(),
            category,
            title,
            description,
            file_link,
            price,
            active: true,
            created_at: env.ledger().timestamp(),
        };

        let mut listings: Vec<Listing> = env.storage().instance().get(&LISTINGS).unwrap_or(Vec::new(&env));
        listings.push_back(listing);
        env.storage().instance().set(&LISTINGS, &listings);
        env.storage().instance().set(&LST_CNTR, &count);

        count
    }

    pub fn update_item(
        env: Env,
        seller: Address,
        id: u64,
        category: String,
        title: String,
        description: String,
        price: i128,
    ) {
        Self::check_initialized(&env);
        seller.require_auth();

        let listings: Vec<Listing> = env.storage().instance().get(&LISTINGS).unwrap_or(Vec::new(&env));
        let mut updated = Vec::new(&env);
        let mut found = false;

        for item in listings.iter() {
            if item.id == id {
                if item.seller != seller {
                    panic!("only the seller can update this listing");
                }
                if !item.active {
                    panic!("cannot update an inactive listing");
                }
                let mut new_item = item.clone();
                new_item.category = category.clone();
                new_item.title = title.clone();
                new_item.description = description.clone();
                new_item.price = price;
                new_item.created_at = env.ledger().timestamp();
                updated.push_back(new_item);
                found = true;
            } else {
                updated.push_back(item);
            }
        }

        if !found {
            panic!("listing not found");
        }

        env.storage().instance().set(&LISTINGS, &updated);
    }

    pub fn cancel_item(env: Env, seller: Address, id: u64) {
        Self::check_initialized(&env);
        seller.require_auth();

        let listings: Vec<Listing> = env.storage().instance().get(&LISTINGS).unwrap_or(Vec::new(&env));
        let mut updated = Vec::new(&env);
        let mut found = false;

        for item in listings.iter() {
            if item.id == id {
                if item.seller != seller {
                    panic!("only the seller can cancel this listing");
                }
                if !item.active {
                    panic!("listing is already inactive");
                }
                let mut cancelled = item.clone();
                cancelled.active = false;
                updated.push_back(cancelled);
                found = true;
            } else {
                updated.push_back(item);
            }
        }

        if !found {
            panic!("listing not found");
        }

        env.storage().instance().set(&LISTINGS, &updated);
    }

    pub fn buy_item(env: Env, buyer: Address, id: u64) {
        buyer.require_auth();

        let token_address: Address = env.storage().instance().get(&TOKEN)
            .expect("contract not initialized: call initialize(token_address) first");

        let listings: Vec<Listing> = env.storage().instance().get(&LISTINGS).unwrap_or(Vec::new(&env));
        let mut updated = Vec::new(&env);
        let mut target: Option<Listing> = None;

        for item in listings.iter() {
            if item.id == id {
                if !item.active {
                    panic!("listing is not active");
                }
                if item.seller == buyer {
                    panic!("cannot buy your own listing");
                }
                target = Some(item.clone());
                let mut sold = item.clone();
                sold.active = false;
                updated.push_back(sold);
            } else {
                updated.push_back(item);
            }
        }

        let listing = match target {
            Some(l) => l,
            None => panic!("listing not found"),
        };
        let token_client = token::Client::new(&env, &token_address);
        token_client.transfer(&buyer, &listing.seller, &listing.price);

        let mut order_count: u64 = env.storage().instance().get(&ORD_CNTR).unwrap_or(0);
        order_count += 1;

        let order = Order {
            id: order_count,
            listing_id: id,
            buyer: buyer.clone(),
            seller: listing.seller.clone(),
            total: listing.price,
            timestamp: env.ledger().timestamp(),
        };

        let mut orders: Vec<Order> = env.storage().instance().get(&ORDERS).unwrap_or(Vec::new(&env));
        orders.push_back(order);
        env.storage().instance().set(&ORDERS, &orders);
        env.storage().instance().set(&ORD_CNTR, &order_count);
        env.storage().instance().set(&LISTINGS, &updated);
    }

    pub fn get_listings(env: Env) -> Vec<Listing> {
        env.storage().instance().get(&LISTINGS).unwrap_or(Vec::new(&env))
    }

    pub fn get_active_listings(env: Env) -> Vec<Listing> {
        let all: Vec<Listing> = env.storage().instance().get(&LISTINGS).unwrap_or(Vec::new(&env));
        let mut active = Vec::new(&env);
        for item in all.iter() {
            if item.active {
                active.push_back(item);
            }
        }
        active
    }

    pub fn get_listing(env: Env, id: u64) -> Listing {
        let listings: Vec<Listing> = env.storage().instance().get(&LISTINGS).unwrap_or(Vec::new(&env));
        for item in listings.iter() {
            if item.id == id {
                return item;
            }
        }
        panic!("listing not found");
    }

    pub fn get_my_listings(env: Env, caller: Address) -> Vec<Listing> {
        let all: Vec<Listing> = env.storage().instance().get(&LISTINGS).unwrap_or(Vec::new(&env));
        let mut mine = Vec::new(&env);
        for item in all.iter() {
            if item.seller == caller {
                mine.push_back(item);
            }
        }
        mine
    }

    pub fn get_orders(env: Env, listing_id: u64) -> Vec<Order> {
        let all: Vec<Order> = env.storage().instance().get(&ORDERS).unwrap_or(Vec::new(&env));
        let mut result = Vec::new(&env);
        for order in all.iter() {
            if order.listing_id == listing_id {
                result.push_back(order);
            }
        }
        result
    }
}

mod test;
