package utils

import (
	"errors"
	"regexp"
	"strings"
	"unicode/utf8"
)

var (
	htmlTagRegex = regexp.MustCompile(`<[^>]*>`)

	dangerousRegex = regexp.MustCompile(`(?i)(javascript:|vbscript:|data:text/html|on\w+\s*=)`)

	controlCharRegex = regexp.MustCompile(`[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]`)
)

func SanitizeComment(content string) string {
	content = controlCharRegex.ReplaceAllString(content, "")
	return strings.TrimSpace(content)
}

func ValidateCommentContent(content string) error {
	length := utf8.RuneCountInString(content)
	if length < 2 {
		return errors.New("comment is too short")
	}
	if length > 2000 {
		return errors.New("comment is too long")
	}
	if htmlTagRegex.MatchString(content) {
		return errors.New("HTML tags are not allowed")
	}
	if dangerousRegex.MatchString(content) {
		return errors.New("content contains forbidden patterns")
	}
	return nil
}