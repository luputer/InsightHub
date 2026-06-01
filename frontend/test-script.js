import { StellarContractsKit } from 'stellar-contracts-kit';
const kit = new StellarContractsKit({ network: 'testnet' });
async function run() {
    try {
        const contract = await kit.contract('CAXKDACN2ZVY7KEBYNM7UNOH7YF3P4HGO737PPJPJ2EQQZJGKPJSMVK3');
        console.log('Contract:', contract);
        console.log('Keys:', Object.keys(contract));
        console.log('get_notes:', contract.get_notes);
    } catch (e) {
        console.error('Error:', e);
    }
}
run();
