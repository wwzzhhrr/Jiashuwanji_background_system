import {useEffect} from "react";
import {useTracking} from "./index.tsx";

export function Demo() {
  const { trackEvent } = useTracking();

  useEffect(() => {
    const enterTime = Date.now();

    return () => {
      if (!trackEvent) return;
      const duration = Date.now() - enterTime;
      trackEvent({
        eventType: 'EVENT', // 使用 EVENT 表示自定义事件
        url: window.location.href,
        elementId: 'demo-component',
        metadata: {
          page: 'demo',
          durationMs: duration,
          eventName: 'component_unmount' // 通过 metadata 区分具体事件
        }
      });
    };
  }, [trackEvent]);

  const handleAddToCart = () => {
    trackEvent({
      eventType: 'EVENT', // 使用 EVENT 表示按钮点击
      url: 'https://example.com/products/123',
      elementId: 'add-to-cart-btn',
      metadata: {
        productId: 123,
        price: 99.99,
        eventName: 'add_to_cart' // 通过 metadata 区分具体事件
      }
    });
  };

  return (
      <div>
        <button onClick={handleAddToCart}>Add to Cart</button>
      </div>
  );
}