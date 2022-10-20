import { Fragment } from 'react';
import { CCXExplorerLink, FormattedAmount, TimeAgo } from '../../helpers/Strings';


const MinerPayments = props => {
  const { address, miners } = props;

  return (
    <div>
      <h4>Payments</h4>
      {miners[address].payments?.map(payment =>
        <Fragment key={payment.ts}>
          <div>
            <TimeAgo time={payment.ts} /> <FormattedAmount amount={payment.amount} minimumFractionDigits={0} divide /> <CCXExplorerLink hash={payment.txnHash} shortHash /> {payment.mixin} {payment.pt}</div>
        </Fragment>
      )}
    </div>
  );
}

export default MinerPayments;
