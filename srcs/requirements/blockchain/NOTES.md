. 📂 blockchain
├── 📄 Dockerfile                                       # Dockerfile defining containerized environment for deploying/testing smart contracts
├── 📄 NOTES.md                                         # Developer notes and miscellaneous information related to project setup or usage
└── 📂 conf/
│  └── 📂 output/                                       # Output related to contract deployment
│    ├── 📄 deploy.log                                  # Log file capturing the output of the deployment process
│    ├── 📄 blockchain_address.txt                      # Extracted contract address for use by deployment scripts
├── 📄 deploy.sh                                        # Entrypoint script used by Docker to build and deploy the smart contract
└── 📂 tools/
│  └── 📂 contracts/
│    └── 📂 TournamentsStorage/
│      ├── 📄 foundry.toml                              # Main configuration file for the Foundry-based smart contract project
│      └── 📂 lib/
│        └── 📂 forge-std/                              # Foundry standard library for smart contract testing and scripting
│          ├── 📄 foundry.toml                          # Configuration specific to the forge-std project
│          ├── 📄 package.json                          # Node.js package manifest
│          └── 📂 scripts/
│            ├── 📄 vm.py                               # Helper script for interacting with the Foundry virtual machine (VM)
│          └── 📂 src/                                  # Core source files for the forge-std library, including base contracts, testing utilities, logging tools, and standard cheat codes
│            ├── 📄 Base.sol
│            ├── 📄 Script.sol
│            ├── 📄 StdAssertions.sol
│            ├── 📄 StdChains.sol
│            ├── 📄 StdCheats.sol
│            ├── 📄 StdError.sol
│            ├── 📄 StdInvariant.sol
│            ├── 📄 StdJson.sol
│            ├── 📄 StdMath.sol
│            ├── 📄 StdStorage.sol
│            ├── 📄 StdStyle.sol
│            ├── 📄 StdToml.sol
│            ├── 📄 StdUtils.sol
│            ├── 📄 Test.sol
│            ├── 📄 Vm.sol
│            ├── 📄 console.sol
│            ├── 📄 console2.sol
│            └── 📂 interfaces/                         # Interface definitions for standard Ethereum token protocols and utility contracts
│              ├── 📄 IERC1155.sol
│              ├── 📄 IERC165.sol
│              ├── 📄 IERC20.sol
│              ├── 📄 IERC4626.sol
│              ├── 📄 IERC721.sol
│              ├── 📄 IMulticall3.sol
│            ├── 📄 safeconsole.sol
│          └── 📂 test/                                 # Test contracts for forge-std components and utilities, including cheat codes, assertions, storage, and JSON handling
│            ├── 📄 StdAssertions.t.sol
│            ├── 📄 StdChains.t.sol
│            ├── 📄 StdCheats.t.sol
│            ├── 📄 StdError.t.sol
│            ├── 📄 StdJson.t.sol
│            ├── 📄 StdMath.t.sol
│            ├── 📄 StdStorage.t.sol
│            ├── 📄 StdStyle.t.sol
│            ├── 📄 StdToml.t.sol
│            ├── 📄 StdUtils.t.sol
│            ├── 📄 Vm.t.sol
│            └── 📂 compilation/                        # Tests and scripts related to contract compilation scenarios
│              ├── 📄 CompilationScript.sol
│              ├── 📄 CompilationScriptBase.sol
│              ├── 📄 CompilationTest.sol
│              ├── 📄 CompilationTestBase.sol
│            └── 📂 fixtures/                           # Test fixture files including logs and configuration samples
│              ├── 📄 broadcast.log.json
│              ├── 📄 test.json
│              ├── 📄 test.toml
│      └── 📂 script/
│        ├── 📄 DeployTournamentsStorage.s.sol          # Deployment script for the `TournamentsStorage` contract
│      └── 📂 src/
│        ├── 📄 TournamentsStorage.sol                  # Main contract source that stores tournament data
│      └── 📂 test/
│        ├── 📄 TestTournamentsStorage.t.sol            # Unit tests for the `TournamentsStorage` contract

## Notes
- The command 'npm install ethers' will be needed to install the ethers.js library

- Run npx http-server -p 8080 (inside the html folder) to localy test the contract