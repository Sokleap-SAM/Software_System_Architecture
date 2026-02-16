# Scaling & Performance Lab Report

## 1. SLO/SLI Definition (P95 Target)

**SLO (Service Level Objective):** The performance goal we aim to meet - P95 latency should be ≤ 500ms

**SLI (Service Level Indicator):** The actual metrics we measure - P95/P99 latency, RPS, error rate

**P95 Target:** ≤ 500ms (95% of requests should complete within 500ms)

---

## 2. Baseline vs After Improvements

| Metric | Baseline | With HPA | With Caching |
|--------|----------|----------|--------------|
| Replicas | 2 (fixed) | 2-10 (auto) | 2-10 (auto) |
| RPS | 700.56 | 1125.39 | 5890.26 |
| P95 Latency | ~287ms | ~417ms | ~205ms |
| P99 Latency | 383.06ms | 514.44ms | 353.20ms |
| Errors | None | None | None |

*P95 calculated from P90 and P99 data

---

## 3. Why HPA Helped

HPA automatically scales pods based on CPU usage (target: 60%). When traffic increases and CPU goes up, Kubernetes adds more pods (up to 10) to handle the load. This spreads the requests across multiple pods instead of overloading just 2 pods, which reduces latency and prevents errors. When traffic drops, it scales back down to save resources.

---

## 4. Why Caching Helped

The cache-api has a slow operation that takes 500ms to compute. Without caching, every request waits 500ms. With Redis caching (10s TTL), the first request computes and stores the result, then subsequent requests get it from cache in under 10ms. This means most requests are super fast, reducing overall CPU load and improving P95/P99 latencies dramatically.
