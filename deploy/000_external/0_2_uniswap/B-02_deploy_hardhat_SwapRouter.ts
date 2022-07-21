import 'dotenv/config';

import chalk from 'chalk';

import {HardhatRuntimeEnvironment} from 'hardhat/types';
import {DeployFunction} from 'hardhat-deploy/types';

import {
    abi as SWAP_ROUTER_ABI,
    bytecode as SWAP_ROUTER_BYTECODE,
  } from '@uniswap/v3-periphery/artifacts/contracts/SwapRouter.sol/SwapRouter.json'

import {utils,} from 'ethers';


const { formatUnits,parseEther,parseUnits} = utils;


const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
    
  const {deployments, getNamedAccounts, network} = hre;
  const {deploy, execute ,get, log } = deployments;
  const {deployer} = await getNamedAccounts();

  log(chalk.cyan(`.....`));
  log(chalk.cyan(`Starting Script.....`));

  log(`Deploying contracts with the account: ${deployer}`);


  const balance = await hre.ethers.provider.getBalance(deployer);
  log(`Account balance: ${formatUnits(balance, 'ether')} ETH`);


  log(chalk.yellow(`Network Name: ${network.name}`));
  log("----------------------------------------------------")


  const  Args : {[key: string]: any} = {};
  
  Args[`factory`] = (await get('UniswapV3Factory')).address;;
  Args[`WETH9`] = (await get('TokenWETH')).address;

  const deploymentName = "SwapRouter"
  const Result = await deploy(deploymentName, {
    from: deployer,
    args: Object.values(Args),
    log: true,
    contract: {
      abi: SWAP_ROUTER_ABI,
      bytecode: SWAP_ROUTER_BYTECODE
    }
  });
  
  log("------------------ii---------ii---------------------")
  log(`Could be found at ....`)
  log(chalk.yellow(`/deployment/${network.name}/${deploymentName}.json`))

  if (Result.newlyDeployed) {
    
    log(`contract address: ${chalk.green(Result.address)} using ${Result.receipt?.gasUsed} gas`);

    for(var i in Args){
      log(chalk.yellow( `Argument: ${i} - value: ${Args[i]}`));
    }

    if(hre.network.tags.production || hre.network.tags.staging){

      try {
          
          await hre.run("verify:verify", {
              address: Result.address,
              constructorArguments: Object.values(Args),
          });

          }
      catch(err) {
          console.log(err)
      }
    }
    
  }

  log(chalk.cyan(`Ending Script.....`));
  log(chalk.cyan(`.....`)); 

    
}
export default func;
func.tags = ["02-B2","02","swap-router","uniswap",'external'];
func.dependencies = ["02-B1"];


func.skip = async function (hre: HardhatRuntimeEnvironment) {


  //not use for mainnet fork test,generate local host, or production testnet
  
  //1) mainnet fork test    hre.network.name == 'hardhat' && isMainnetForking == true
  //2) generate local host  hre.network.name == 'localhost' && isMainnetForking == true
  //3) production           hre.network.name == 'bscMainnet' && isMainnetForking == false
  //4) testnet              hre.network.name == 'bscTestnet' && isMainnetForking == false


  //use for generate hardhat, unit test
  //1) generate hardhat     hre.network.name == 'hardhat' && isMainnetForking == false
  //2) unit test            hre.network.name == 'hardhat' && isMainnetForking == false

  let isForking = process.env.HARDHAT_FORK == undefined ? false: true


  if( (hre.network.name == 'hardhat' && isForking)
     || (hre.network.name == 'localhost' && isForking)
     || (hre.network.name == 'mainnet' && !isForking)  
     || (hre.network.name == 'bscmainnet' && !isForking) 
     || (hre.network.name == 'rinkeby' && !isForking) ){
        return true;
    } else{
        return false;
    }

};