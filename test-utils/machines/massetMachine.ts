
import { Address } from "../../types/common";
import { BigNumber } from "@utils/tools";
import { DEFAULT_DECIMALS, DEFAULT_SUPPLY } from "@utils/constants";
import { Basset, BassetStatus } from "@utils/mstable-objects";

import {
  MassetContract,
} from "../contracts";

const MassetArtifact = artifacts.require("Masset");

export class MassetMachine {
  private deployer: Address;
  private TX_DEFAULTS: any;

  constructor(accounts: Address[], defaultSender: Address, defaultGas: number = 500000) {
    this.deployer = accounts[0];
    this.TX_DEFAULTS = {
      from: defaultSender,
      gas: defaultGas,
    };
  }

  public async getMassetAtAddress(
    address: Address,
  ): Promise<MassetContract> {
    return new MassetContract(
      address,
      web3.currentProvider,
      this.TX_DEFAULTS,
    );
  }

  public async getBassetsInMasset(
    address: Address,
  ): Promise<Basset[]> {
    const masset = await this.getMassetAtAddress(address);
    const bArrays = await masset.getBassets.callAsync();

    return this.convertToBasset(bArrays);
  }

  private convertToBasset = (bArrays: any[]): Basset[] => {
    return bArrays[0].map((_, i) => {
      return {
        addr: bArrays[0][i],
        decimals: null,
        key: bArrays[1][i],
        ratio: bArrays[2][i],
        targetWeight: bArrays[3][i],
        vaultBalance: bArrays[4][i],
        status: bArrays[5][i],
      };
    });
  }
}