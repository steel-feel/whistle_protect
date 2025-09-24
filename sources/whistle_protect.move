module whistle_protect::smart_table {
    use std::signer;
    use aptos_framework::resource_account::{Self };
    use aptos_framework::big_ordered_map::{Self, BigOrderedMap};

    struct Message has key, store {
        data : BigOrderedMap<u64, u64>,
    }

  public entry fun initialize_module(deployer: &signer) {
       // let account_addr = signer::address_of(account);
        // assert!(!exists<Message>(account_addr), error::already_exists(EBILLBOARD_ALREADY_EXISTS));

        move_to(deployer, Message {
            data: big_ordered_map::new<u64, u64>()
        });
    }

    #[test_only]
    use aptos_framework::account;

    #[test(deployer = @whistle_protect)]
    fun test_table_has_been_created(deployer: signer){
        account::create_account_for_test(signer::address_of(&deployer));
        initialize_module(&deployer);
    }
}