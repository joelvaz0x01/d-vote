module.exports = {
  networks: {
    development: {
        host: "127.0.0.1",
        port: 8545,
        network_id: "*"
    },
    build: {
      host: "127.0.0.1",
      port: 8268,
      network_id: "*"
    },
  },
  contracts_directory: './src/contracts/',
  contracts_build_directory: './src/abis/',
  compilers: {
    solc: {
      version: "0.8.1",
      settings: {
        optimizer: {
          enabled: true,
          runs: 200
        }
      }
    }
  }
}
