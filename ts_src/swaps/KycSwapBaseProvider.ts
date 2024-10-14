import { Asset, ExchangeRange, ExchangeStatus, Order, OrderId } from './types';

export abstract class KycSwapBaseProvider {
  public abstract minimumOrder(order: Order): Promise<ExchangeRange>;
  public abstract placeOrder(order: Order): Promise<Order>;
  public abstract orderStatus(orderId: OrderId): Promise<ExchangeStatus>;
  public abstract quote(order: Order): Promise<ExchangeRange>;
  public abstract assets(): Promise<Asset[]>;
  // still need list of pairs
}
