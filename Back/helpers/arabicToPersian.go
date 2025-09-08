package helpers

import "strings"

func NormalizePersian(input string) string {
	replacer := strings.NewReplacer(
		"ي", "ی",
		"ك", "ک",
	)
	return replacer.Replace(strings.TrimSpace(input))
}
