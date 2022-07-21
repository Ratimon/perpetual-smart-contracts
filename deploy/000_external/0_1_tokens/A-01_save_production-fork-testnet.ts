import 'dotenv/config';

import chalk from 'chalk';

import {HardhatRuntimeEnvironment} from 'hardhat/types';
import { DeployFunction, DeploymentSubmission } from 'hardhat-deploy/types';

import WETH_ABI from "../../../assets/abis/external/WETH.json";
import ERC20_ABI from "../../../assets/abis/external/ERC20.json";

import { utils} from 'ethers';
const { formatUnits,parseEther,parseUnits} = utils;

  
const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
    
    const {deployments, getNamedAccounts, network} = hre;
    const {deploy, getOrNull, log ,save } = deployments;
    const {
      deployer,
      WETH,
      USDC
    } = await getNamedAccounts();

    log(chalk.cyan(`.....`));
    log(chalk.cyan(`Starting Script.....`));
  
    log(`Saving contracts ....`);
  

    log(chalk.yellow(`Network Name: ${network.name}`));
    log("----------------------------------------------------");


    const wethSubmission : DeploymentSubmission = {
      abi: WETH_ABI,
      address: WETH
    }
    const wethDeploymentName = `TokenWETH`
    await save(wethDeploymentName, wethSubmission);
    let existingWETH = await getOrNull(wethDeploymentName);
    if(existingWETH) {
      log(`Deployment Saved: ${wethDeploymentName} with address ${chalk.green(existingWETH.address)}`);
    }


    const usdcSubmission : DeploymentSubmission = {
      abi: ERC20_ABI,
      address: USDC
    }
    const usdcDeploymentName = `TokenUSDC`
    await save(usdcDeploymentName, usdcSubmission);
    let existingUSDC = await getOrNull(usdcDeploymentName);
    if(existingUSDC) {
      log(`Deployment Saved: ${usdcDeploymentName} with address ${chalk.green(existingUSDC.address)}`);
    }




    log(chalk.cyan(`Ending Script.....`));
    log(chalk.cyan(`.....`));

    
  
}
export default func;
func.tags = ["A-1-01","0-1","weth","usdc","tokens",'external'];

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