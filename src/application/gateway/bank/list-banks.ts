import { banks } from './banks';

export class ListBanks {
  async listAll() {
    return banks;
  }
}
