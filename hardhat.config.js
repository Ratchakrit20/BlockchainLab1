require("@nomiclabs/hardhat-ethers");
/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.28",
  defaultNetwork: "ganache",
  networks: {
    hardhat: {},
    ganache: {
      url: "HTTP://127.0.0.1:7545",
      accounts: ["0x0b115d5767f91b486a07002348c9edcf034d01883aff354883f1cd1bd7fd2173"],
    },
  },
};
