export const authState = {
  isRefreshing: false,
  isRedirecting: false,
};

let refreshSubscribers: (() => void)[] = [];

export const subscribeTokenRefresh = (cb: () => void) => {
  refreshSubscribers.push(cb);
};

export const onRefreshed = () => {
  refreshSubscribers.forEach((cb) => cb());
  refreshSubscribers = [];
};
