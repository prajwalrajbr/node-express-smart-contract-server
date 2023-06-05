import express from 'express';

import web3 from 'web3';
import HDWalletProvider from '@truffle/hdwallet-provider';

const SERVER = express();
const PORT = 9001;

SERVER.use(express.json());
SERVER.use(express.urlencoded({ extended: true }));

SERVER.listen(PORT, () => {
   console.log(`Server running on port ${PORT}`);
});

const apikey = "888992a1d9a948c781d2e4c84d060c58"
const mnemonic = "desert flat hard arch club kiwi blind stand glove swallow clump tiger"

const provider = new HDWalletProvider(mnemonic, `https://sepolia.infura.io/v3/${apikey}`);
const Web3 = new web3(provider);

const PackagingAgreement = await import("./PackagingAgreements.json", {
    assert: {
      type: "json",
    },
});

const networkID = await Web3.eth.net.getId();
const contractAddress = PackagingAgreement["default"]["networks"][networkID]["address"];

const Instance = new Web3.eth.Contract(
    PackagingAgreement["default"]["abi"],
    contractAddress
);

const gasPrice = await Web3.eth.getGasPrice();
const gasLimit = 300000;

SERVER.post('/createPackagingAgreement', async function (req, res) {

   try {
      var payload = req.body;
      const transactionObject = await Instance.methods.createPackagingAgreement(
         payload.projectName, 
         payload.internalNumber, 
         payload.externalNumber, 
         payload.processor, 
         payload.dueDate, 
         payload.trialDeliveryStartDate, 
         payload.productiveDeliveryStartdate, 
         payload.version, 
         payload.status, 
         payload.materialNumberInternal
      );
   
      const signedTransaction = await Web3.eth.accounts.signTransaction(
         {
           to: contractAddress,
           data: transactionObject.encodeABI(),
           gas: gasLimit,
           gasPrice: gasPrice,
         },
         "40d3bd6d966a5dc13a257d3279c39361b8aa53ebcecbe8e90c465e64b6629a6b"
      );
   
      const transactionReceipt = await Web3.eth.sendSignedTransaction(signedTransaction.rawTransaction);
      const transactionHash = transactionReceipt.transactionHash;
   
      const returnValue = await Instance.methods.createPackagingAgreement(
         payload.projectName, 
         payload.internalNumber, 
         payload.externalNumber, 
         payload.processor, 
         payload.dueDate, 
         payload.trialDeliveryStartDate, 
         payload.productiveDeliveryStartdate, 
         payload.version, 
         payload.status, 
         payload.materialNumberInternal
      ).call({ transactionHash });
   
      res.status(201).json({
        message: "Successfully created PacakgingAgreement",
        contractIndex: returnValue,
      });
   } catch (error) {
      res.status(500).json({
        message: "Failed to create PacakgingAgreement",
      });
   }
});

SERVER.post('/createMaterialDimensions', async function (req, res) {

   try {
      var payload = req.body;
      const transactionObject = await Instance.methods.createMaterialDimensions(
         payload.contractIndex, 
         payload.lengthAndBreadth, 
         payload.weight, 
         payload.height, 
         payload.volume, 
         payload.fillingQuantity, 
         payload.lengthUOMAndBreadthUOM, 
         payload.weightUOM, 
         payload.heightUOM, 
         payload.volumeUOM,
         payload.quantityUOM
      );
   
      const signedTransaction = await Web3.eth.accounts.signTransaction(
         {
           to: contractAddress,
           data: transactionObject.encodeABI(),
           gas: gasLimit,
           gasPrice: gasPrice,
         },
         "40d3bd6d966a5dc13a257d3279c39361b8aa53ebcecbe8e90c465e64b6629a6b"
      );
   
      const transactionReceipt = await Web3.eth.sendSignedTransaction(signedTransaction.rawTransaction);
      const transactionHash = transactionReceipt.transactionHash;
   
      const returnValue = await Instance.methods.createMaterialDimensions(
         payload.contractIndex, 
         payload.lengthAndBreadth, 
         payload.weight, 
         payload.height, 
         payload.volume, 
         payload.fillingQuantity, 
         payload.lengthUOMAndBreadthUOM, 
         payload.weightUOM, 
         payload.heightUOM, 
         payload.volumeUOM,
         payload.quantityUOM
      ).call({ transactionHash });
   
      res.status(201).json({
        message: "Successfully created MaterialDimensions",
      });
   } catch (error) {
      res.status(500).json({
        message: "Failed to create MaterialDimensions",
      });
   }
});

SERVER.post('/updatePackagingAgreement', (req, res) => {
   try {
      res.status(201).json({
        message: "Successfully created a new user",
      });
   } catch (error) {
      res.status(500).json({
        message: "Failed to create user",
      });
   }
});

SERVER.post('/UpdateMaterialDimensions', (req, res) => {
   try {
      res.status(201).json({
        message: "Successfully created a new user",
      });
   } catch (error) {
      res.status(500).json({
        message: "Failed to create user",
      });
   }
});
