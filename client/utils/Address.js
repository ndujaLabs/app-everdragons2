const { toChecksumAddress } = require("ethereumjs-util");

class Address {
  static equal(addr1, addr2) {
    try {
      let result = toChecksumAddress(addr1) === toChecksumAddress(addr2);
      return result;
    } catch (e) {
      return false;
    }
  }

  static isAdmin(addr) {
    return Address.equal(addr, "0x75543056D9cA56B29FfcCF873d5C2Cfc91f412b4");
  }
}

module.exports = Address;
