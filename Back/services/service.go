package services

import (
	"github.com/AlirezaSaadatmand/Ja-Ostadi/pkg/logging"
)

type Services struct {
	Logger logging.Logger
}

func NewServices(logger logging.Logger) *Services {
	return &Services{
		Logger: logger,
	}
}
