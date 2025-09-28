package handlers

import (
	"github.com/AlirezaSaadatmand/Ja-Ostadi/pkg/logging"
	"github.com/AlirezaSaadatmand/Ja-Ostadi/scraper"
	"github.com/AlirezaSaadatmand/Ja-Ostadi/services"
)

type Handler struct {
	Logger   logging.Logger
	Services *services.Services
	Scraper *scraper.ScraperService
}

func NewHandler(logger logging.Logger) *Handler {
	scr := scraper.NewScraperServices(logger)
	svc := services.NewServices(logger)
	return &Handler{
		Logger:   logger,
		Services: svc,
		Scraper: scr,
	}
}
