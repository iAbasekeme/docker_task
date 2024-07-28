import { BadRequestException, Injectable, Logger } from '@nestjs/common';

@Injectable()
export class AccountNameResolver {
  logger = new Logger(AccountNameResolver.name);
  async resolve(acctNumber: string, sortCode: string) {
    try {
      const response = await fetch(
        `https://api.paystack.co/bank/resolve?account_number=${acctNumber}&bank_code=${sortCode}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization:
              'Bearer sk_test_3d90b7167015bf108b370f25fca1bad8c638759d',
          },
        },
      );

      if (!response.ok) {
        throw new Error('Request failed: could not resolve account details');
      }
      const data = await response.json();
      this.logger.log(data);
      const { account_number: accountNumber, account_name: accountName } =
        data?.data || {};
      return { accountNumber, accountName };
    } catch (error) {
      this.logger.error(error);
      throw new BadRequestException(error);
    }
  }
}
