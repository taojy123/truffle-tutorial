var MyFlag = artifacts.require('./MyFlag.sol')

module.exports = function (deployer) {
  deployer.deploy(MyFlag)
}
