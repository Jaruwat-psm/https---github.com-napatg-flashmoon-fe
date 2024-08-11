import { BrowserProvider, Contract } from 'ethers';
import abi from '../Abi/MyContract.json';
import usdtAbi from '../Abi/UsdtTokenAbi.json';

// ที่อยู่ของสัญญา FlashMoonSoldility
const contractAddress = '0x50C95112C574bca5D219a0059A8346a4a4c17A15';
// ABI ของสัญญา FlashMoonSoldility
const contractABI = abi;

// ที่อยู่ของสัญญา USDT
const usdtTokenAddress = '0x337610d27c682E347C9cD60BD4b3b107C9d34dDd';
// ABI ของสัญญา USDT
const usdtTokenABI = usdtAbi;

export const getContract = async () => {
  if (!window.ethereum) {
    throw new Error('No crypto wallet found. Please install it.');
  }

  await window.ethereum.request({ method: 'eth_requestAccounts' });
  const provider = new BrowserProvider(window.ethereum);
  const signer = await provider.getSigner();
  return new Contract(contractAddress, contractABI, signer);
};

export const getUsdtContract = async () => {
  if (!window.ethereum) {
    throw new Error('No crypto wallet found. Please install it.');
  }

  await window.ethereum.request({ method: 'eth_requestAccounts' });
  const provider = new BrowserProvider(window.ethereum);
  const signer = await provider.getSigner();
  return new Contract(usdtTokenAddress, usdtTokenABI, signer);
};