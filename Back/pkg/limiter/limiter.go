package limiter

import (
	"sync"
	"time"
)

type TokenBucket struct {
	capacity   int
	tokens     int
	refill     int
	interval   time.Duration
	lastRefill time.Time
	mu         sync.Mutex
}

func NewTokenBucket(capacity, refill int, interval time.Duration) *TokenBucket {
	return &TokenBucket{
		capacity:   capacity,
		tokens:     capacity,
		refill:     refill,
		interval:   interval,
		lastRefill: time.Now(),
	}
}

func (tb *TokenBucket) Allow() bool {
	tb.mu.Lock()
	defer tb.mu.Unlock()

	now := time.Now()
	elapsed := now.Sub(tb.lastRefill)
	if elapsed >= tb.interval {
		newTokens := int(elapsed/tb.interval) * tb.refill
		tb.tokens = min(tb.capacity, tb.tokens+newTokens)
		tb.lastRefill = now
	}

	if tb.tokens > 0 {
		tb.tokens--
		return true
	}
	return false
}

func min(a, b int) int {
	if a < b {
		return a
	}
	return b
}
