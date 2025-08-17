package handlers

import (
	"github.com/AlirezaSaadatmand/Ja-Ostadi/pkg/logging"
	"github.com/AlirezaSaadatmand/Ja-Ostadi/services"
)

type Handler struct {
	Logger   logging.Logger
	Services *services.Services
}

func NewHandler(logger logging.Logger) *Handler {
	svc := services.NewServices(logger)
	return &Handler{
		Logger:   logger,
		Services: svc,
	}
}
