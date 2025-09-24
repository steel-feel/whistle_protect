module whistle_protect::smart_table {
    use std::string::String;
    use std::signer;
     use std::error;
    use aptos_framework::big_ordered_map::{Self, BigOrderedMap};

    const EVAL_NOT_FOUND: u64 = 1;

    struct Message has key, store {
        data : BigOrderedMap<u64, String>
    }

   public entry fun initialize_module(deployer: &signer) {
       // let account_addr = signer::address_of(account);
        // assert!(!exists<Message>(account_addr), error::already_exists(EBILLBOARD_ALREADY_EXISTS));

        move_to(deployer, Message {
            data: big_ordered_map::new<u64, String>()
        });
    }

    public entry fun add_entry( user: &signer, verifier: &signer, key: u64, value : String) acquires Message {
          let w_obj = borrow_global_mut<Message>(@whistle_protect);
          w_obj.data.add(key, value);

    }

     #[view]
    public fun get_messages(index:u64): String acquires Message {
        let billboard = &Message[@whistle_protect];
        let r =  billboard.data.get(&index);
        assert!(r.is_some(), error::not_found(EVAL_NOT_FOUND));
        r.extract()
    }

    #[test_only]
    use aptos_framework::account;

    #[test(deployer = @whistle_protect)]
    fun test_table_has_been_created(deployer: signer){
        account::create_account_for_test(signer::address_of(&deployer));
        initialize_module(&deployer);
    }

}