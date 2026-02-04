package middlewares

import (
	"github.com/AlirezaSaadatmand/Ja-Ostadi/pkg/logging"
)

type Middlewares struct {
	Logger logging.Logger
}

func NewMiddleware(logger logging.Logger) *Middlewares {
	return &Middlewares{
		Logger: logger,
	}
}
