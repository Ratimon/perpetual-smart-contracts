// import { config as dotenvConfig } from "dotenv";
import 'dotenv/config';
import {HardhatUserConfig} from 'hardhat/types';
// import { NetworkUserConfig } from "hardhat/types";

import "@nomiclabs/hardhat-ethers";
import "@nomiclabs/hardhat-etherscan";
import "@nomiclabs/hardhat-web3";
import 'hardhat-deploy-ethers';
import '@nomiclabs/hardhat-waffle';
import '@typechain/hardhat';
import "hardhat-contract-sizer";
import 'hardhat-deploy';
import "solidity-coverage"
import 'hardhat-tracer';
import "hardhat-log-remover"
import "hardhat-storage-layout"
import "@tenderly/hardhat-tenderly"


import {node_url, accounts, addForkConfiguration} from './utils/network';

import tasks from './tasks'
for (const tsk of tasks) { tsk() }



const ETHERSCAN_KEY = process.env.ETHERSCANKEY;



const config: HardhatUserConfig = {


  solidity: {

    compilers: [


      {
        version: "0.7.6",
        settings: {
          optimizer: {
            enabled: true,
            runs: 200
          },
          outputSelection: {
            "*": {
                "*": ["storageLayout"],
            },
          },
        }
      }
      
    ],


  },
  namedAccounts: {
    deployer: 0,
    dev: 1,


    ZERO: "0x0000000000000000000000000000000000000000",

    // mainnet fork testing
    WETH: {
      1337: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
      1: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
      4: "0xc778417E063141139Fce010982780140Aa0cD5Ab", //Mapped from https://rinkeby.etherscan.io/address/0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D#readContract
      5: "0xB4FBF271143F4FBf7B91A5ded31805e42b2208d6",  //Mapped from https://goerli.etherscan.io/address/0xb4fbf271143f4fbf7b91a5ded31805e42b2208d6#writeContract
      10: "0x4200000000000000000000000000000000000006"  //Mapped from https://docs.uniswap.org/protocol/reference/deployments
    },

    USDC: {
      1337: "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
      1: "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
      4: '0x27415c30d8c87437becbd4f98474f26e712047f4', //Mapped from https://github.com/opynfinance/squeeth-monorepo/blob/main/packages/hardhat/tasks/utils.ts
      5: '0x07865c6E87B9F70255377e024ace6630C1Eaa37F', //Mapped from https://goerli.etherscan.io/address/0x07865c6e87b9f70255377e024ace6630c1eaa37f
      10: "0x7F5c764cBc14f9669B88837ca1490cCa17c31607"  //Mapped from https://docs.uniswap.org/protocol/reference/deployments
    },


    UNISWAP_FACTORY: {
      1337: "0x1F98431c8aD98523631AE4a59f267346ea31F984",
      1: "0x1F98431c8aD98523631AE4a59f267346ea31F984",  //Mapped from  https://docs.uniswap.org/protocol/reference/deployments
      4: "0x1F98431c8aD98523631AE4a59f267346ea31F984", //Mapped from https://docs.uniswap.org/protocol/reference/deployments
      5: "0x1F98431c8aD98523631AE4a59f267346ea31F984",  //https://docs.uniswap.org/protocol/reference/deployments
      10: "0x1F98431c8aD98523631AE4a59f267346ea31F984"  //Mapped from https://docs.uniswap.org/protocol/reference/deployments
    },

    SWAP_ROUTER: {
      1337: "0xE592427A0AEce92De3Edee1F18E0157C05861564",
      1: "0xE592427A0AEce92De3Edee1F18E0157C05861564",  //Mapped from  https://docs.uniswap.org/protocol/reference/deployments
      4: "0xE592427A0AEce92De3Edee1F18E0157C05861564", //Mapped from https://docs.uniswap.org/protocol/reference/deployments
      5: "0xE592427A0AEce92De3Edee1F18E0157C05861564",  //https://docs.uniswap.org/protocol/reference/deployments
      10: "0xE592427A0AEce92De3Edee1F18E0157C05861564"  //Mapped from https://docs.uniswap.org/protocol/reference/deployments
    },

    NONFUNGIBLE_POSITION_MANAGER: {
      1337: "0xC36442b4a4522E871399CD717aBDD847Ab11FE88",
      1: "0xC36442b4a4522E871399CD717aBDD847Ab11FE88",  //Mapped from  https://docs.uniswap.org/protocol/reference/deployments
      4: "0xC36442b4a4522E871399CD717aBDD847Ab11FE88", //Mapped from https://docs.uniswap.org/protocol/reference/deployments
      5: "0xC36442b4a4522E871399CD717aBDD847Ab11FE88",  //https://docs.uniswap.org/protocol/reference/deployments
      10: "0xC36442b4a4522E871399CD717aBDD847Ab11FE88"  //Mapped from https://docs.uniswap.org/protocol/reference/deployments
    },

    QUOTER: {
      1337: "0xb27308f9F90D607463bb33eA1BeBb41C27CE5AB6",
      1: "0xb27308f9F90D607463bb33eA1BeBb41C27CE5AB6",  //Mapped from  https://docs.uniswap.org/protocol/reference/deployments
      4: "0xb27308f9F90D607463bb33eA1BeBb41C27CE5AB6", //Mapped from https://docs.uniswap.org/protocol/reference/deployments
      5: "0xb27308f9F90D607463bb33eA1BeBb41C27CE5AB6",  //https://docs.uniswap.org/protocol/reference/deployments
      10: "0xb27308f9F90D607463bb33eA1BeBb41C27CE5AB6"  //Mapped from https://docs.uniswap.org/protocol/reference/deployments
    }



  },


  networks: addForkConfiguration({
    hardhat: {
      chainId: 1337,
      initialBaseFeePerGas: 0, // to fix : https://github.com/sc-forks/solidity-coverage/issues/652, see https://github.com/sc-forks/solidity-coverage/issues/652#issuecomment-896330136
      tags: ['test']
    },
    localhost: {
      url: node_url('localhost'),
      accounts: accounts(),
    },
    staging: {
      url: node_url('rinkeby'),
      accounts: accounts('rinkeby'),
      tags: ['staging']
    },
    production: {
      url: node_url('mainnet'),
      accounts: accounts('mainnet'),
    },
    mainnet: {
      url: node_url('mainnet'),
      accounts: accounts('mainnet'),
      tags: ['production']
    },
    rinkeby: {
      url: node_url('rinkeby'),
      accounts: accounts('rinkeby'),
      tags: ['staging']
    },
    kovan: {
      url: node_url('kovan'),
      accounts: accounts('kovan'),
    },
    goerli: {
      url: node_url('goerli'),
      accounts: accounts('goerli'),
    },

    bscmainnet: {
      // url: "https://bsc-dataseed.binance.org/",
      url: node_url('bscmainnet'),
      accounts: accounts('bscmainnet'),
      chainId: 56,
      gasPrice: 5000000000,

      throwOnTransactionFailures: false,
      // if true,  throw stack traces on transaction failures.
      // If false, return  failing transaction hash.
      throwOnCallFailures: true,
      // If is true, will throw  stack traces when a call fails.
      // If false, will return the call's return data, which can contain a revert reason
      tags: ['production'],
    },


    bscmainnetfork: {
      url: node_url('bscmainnetfork'),
      accounts: accounts('bscmainnetfork'),
      tags: ['fork']
    },


    bsctestnet: {
      url: node_url('bsctestnet'),
      accounts: accounts('bsctestnet'),
      chainId: 97,
      gasPrice: 10000000000,

      tags: ["staging"]

    },

  }),

  external: process.env.HARDHAT_FORK
  ? {
      deployments: {
        // process.env.HARDHAT_FORK will specify the network that the fork is made from.
        // these lines allow it to fetch the deployments from the network being forked from both for node and deploy task
        hardhat: ['deployments/' + process.env.HARDHAT_FORK],
        localhost: ['deployments/' + process.env.HARDHAT_FORK],
      },
    }
  : undefined,

  etherscan: {
    // Your API key for Etherscan
    // Obtain one at https://etherscan.io/
    apiKey: ETHERSCAN_KEY 
  },


  paths: {
    sources: './src',
    tests: "./test",
    cache: "./cache",
    artifacts: "./artifacts",
    deploy: './deploy',
    deployments: './deployments',
    imports: './imports'
  },

  typechain: {
    outDir: 'typechain',
    target: 'ethers-v5',
  },

  mocha: {
    timeout: 300000
  },
  
  
  
};

export default config;