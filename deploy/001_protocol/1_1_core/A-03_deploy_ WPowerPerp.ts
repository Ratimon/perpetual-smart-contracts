import 'dotenv/config';

import chalk from 'chalk';

import {HardhatRuntimeEnvironment} from 'hardhat/types';
import {DeployFunction} from 'hardhat-deploy/types';

import {utils,} from 'ethers';

const { formatUnits,parseEther,parseUnits} = utils;


const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
    
  const {deployments, getNamedAccounts, network} = hre;
  const {deploy, execute , log } = deployments;
  const {deployer} = await getNamedAccounts();

  log(chalk.cyan(`.....`));
  log(chalk.cyan(`Starting Script.....`));

  log(`Deploying contracts with the account: ${deployer}`);


  const balance = await hre.ethers.provider.getBalance(deployer);
  log(`Account balance: ${formatUnits(balance, 'ether')} ETH`);


  log(chalk.yellow(`Network Name: ${network.name}`));
  log("----------------------------------------------------")



  const  Args : {[key: string]: any} = {};

  Args[`name`] = 'Opyn Squeeth'
  Args[`symbol`] = 'oSQTH'

  const deploymentName = "WPowerPerp"
  const Result = await deploy(deploymentName,{
    contract: "WPowerPerp",
    from: deployer,
    args: Object.values(Args),
    log: true,
    skipIfAlreadyDeployed: true}
  );
  
  log("------------------ii---------ii---------------------")
  log(`Could be found at ....`)
  log(chalk.yellow(`/deployment/${network.name}/${deploymentName}.json`))

  if (Result.newlyDeployed) {
    
    log(`contract address: ${chalk.green(Result.address)} using ${Result.receipt?.gasUsed} gas`);

    for(var i in Args){
      log(chalk.yellow( `Argument: ${i} - value: ${Args[i]}`));
    }    

    if( network.name != 'hardhat' && ( hre.network.tags.production || hre.network.tags.staging)){

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
func.tags = ["11-A3","11","w-power-perp","core","protocol"];
func.dependencies = ["11-A2"];