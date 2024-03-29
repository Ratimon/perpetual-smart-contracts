import 'dotenv/config';

import chalk from 'chalk';

import {HardhatRuntimeEnvironment} from 'hardhat/types';
import { DeployFunction, DeploymentSubmission } from 'hardhat-deploy/types';

import {
    abi as FACTORY_ABI,
    bytecode as FACTORY_BYTECODE,
  } from '@uniswap/v3-core/artifacts/contracts/UniswapV3Factory.sol/UniswapV3Factory.json'

import {
    abi as SWAP_ROUTER_ABI,
    bytecode as SWAP_ROUTER_BYTECODE,
  } from '@uniswap/v3-periphery/artifacts/contracts/SwapRouter.sol/SwapRouter.json'
  
  import {
    abi as POSITION_MANAGER_ABI,
    bytecode as POSITION_MANAGER_BYTECODE,
  } from '@uniswap/v3-periphery/artifacts/contracts/NonfungiblePositionManager.sol/NonfungiblePositionManager.json'
  
  
  import {
    abi as QUOTER_ABI,
    bytecode as QUOTER_BYTECODE,
  } from '@uniswap/v3-periphery/artifacts/contracts/lens/QuoterV2.sol/QuoterV2.json'


import { utils} from 'ethers';
const { formatUnits,parseEther,parseUnits} = utils;

  
const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
    
    const {deployments, getNamedAccounts, network} = hre;
    const {deploy, getOrNull, log ,save } = deployments;
    const {
      deployer,
      UNISWAP_FACTORY,
      SWAP_ROUTER,
      NONFUNGIBLE_POSITION_MANAGER,
      QUOTER
    } = await getNamedAccounts();

    log(chalk.cyan(`.....`));
    log(chalk.cyan(`Starting Script.....`));
  
    log(`Saving contracts ....`);
  

    log(chalk.yellow(`Network Name: ${network.name}`));
    log("----------------------------------------------------");


    const UniswapV3FactorySubmission : DeploymentSubmission = {
      abi: FACTORY_ABI,
      address: UNISWAP_FACTORY,
      bytecode: FACTORY_BYTECODE
    }
    const UniswapV3FactoryDeploymentName = `UniswapV3Factory`
    await save(UniswapV3FactoryDeploymentName, UniswapV3FactorySubmission);
    let existingUniswapV3Factory = await getOrNull(UniswapV3FactoryDeploymentName);
    if(existingUniswapV3Factory) {
      log(`Deployment Saved: ${UniswapV3FactoryDeploymentName} with address ${chalk.green(existingUniswapV3Factory.address)}`);
    }

    const SwapRouterSubmission : DeploymentSubmission = {
      abi: SWAP_ROUTER_ABI,
      address: SWAP_ROUTER,
      bytecode: SWAP_ROUTER_BYTECODE
    }
    const SwapRouterDeploymentName = `SwapRouter`
    await save(SwapRouterDeploymentName, SwapRouterSubmission);
    let existingSwapRouter = await getOrNull(SwapRouterDeploymentName);
    if(existingSwapRouter) {
      log(`Deployment Saved: ${SwapRouterDeploymentName} with address ${chalk.green(existingSwapRouter.address)}`);
    }

    const NonfungiblePositionManagerSubmission : DeploymentSubmission = {
      abi: POSITION_MANAGER_ABI,
      address: NONFUNGIBLE_POSITION_MANAGER,
      bytecode: POSITION_MANAGER_BYTECODE
    }
    const PositionManagerDeploymentName = `NonfungiblePositionManager`
    await save(PositionManagerDeploymentName, NonfungiblePositionManagerSubmission);
    let existingPositionManager = await getOrNull(PositionManagerDeploymentName);
    if(existingPositionManager) {
      log(`Deployment Saved: ${PositionManagerDeploymentName} with address ${chalk.green(existingPositionManager.address)}`);
    }


    const QUOTERSubmission : DeploymentSubmission = {
      abi: QUOTER_ABI,
      address: QUOTER,
      bytecode: QUOTER_BYTECODE
    }
    const QuoterDeploymentName = `Quoter`
    await save(QuoterDeploymentName, QUOTERSubmission);
    let existingQuoter = await getOrNull(QuoterDeploymentName);
    if(existingQuoter) {
      log(`Deployment Saved: ${QuoterDeploymentName} with address ${chalk.green(existingQuoter.address)}`);
    }

    log(chalk.cyan(`Ending Script.....`));
    log(chalk.cyan(`.....`));

    
  
}
export default func;
func.tags = ["02-A1","02","position-manager","swap-router","nonfungible-manager","quoter","uniswap",'external'];
func.dependencies = ["tokens"];

// func.skip = async (hre) => (await hre.deployments.getNetworkName()) == 'hardhat'; //skip when it is  hardhat
// func.skip = async () => true;


func.skip = async function (hre: HardhatRuntimeEnvironment) {


  //use for mainnet fork test,generate local host, or production , testnet

  //1) mainnet fork test    hre.network.name == 'hardhat' && isMainnetForking == true
  //2) generate local host  hre.network.name == 'localhost' && isMainnetForking == true
  //3) production           hre.network.name == 'bscMainnet' && isMainnetForking == false
  //4) testnet              hre.network.name == 'bscTestnet' && isMainnetForking == false


 //not use for generate hardhat, unit test
  //1) generate hardhat     hre.network.name == 'hardhat' && isMainnetForking == false
  //2) unit test            hre.network.name == 'hardhat' && isMainnetForking == false



  let isForking = process.env.HARDHAT_FORK == undefined ? false: true

  if( (hre.network.name == 'hardhat' && !isForking) ){
        return true;
    } else{
        return false;
    }


};