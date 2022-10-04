import { Fragment } from 'react';
import { CCXExplorerLink, FormattedAmount } from '../../helpers/utils';


const MinerPayments = props => {
  const { address, miners } = props;

  return (
    <div>
      <h4>Payments</h4>
      {miners[address].payments?.map(payment =>
        <Fragment key={payment.ts}>
          <div>{new Date(payment.ts * 1000).toLocaleString()} <FormattedAmount amount={payment.amount} divide /> <CCXExplorerLink hash={payment.txnHash} shortHash /> {payment.mixin} {payment.pt}</div>
        </Fragment>
      )}
    </div>
  );
}

export default MinerPayments;
