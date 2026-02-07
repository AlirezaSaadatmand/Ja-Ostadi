package logging

type Category string
type SubCategory string
type ExtraKey string

const (
	General         Category = "General"
	IO              Category = "IO"
	Internal        Category = "Internal"
	Mysql           Category = "MySQL"
	Validation      Category = "Validation"
	RequestResponse Category = "RequestResponse"
	Scraper         Category = "Scraper"
)

const (
	// General
	Startup         SubCategory = "Startup"
	ExternalService SubCategory = "ExternalService"
	Login           SubCategory = "ScraperLogin"

	// MYSQL
	Connection SubCategory = "Connection"
	Migration  SubCategory = "Migration"
	Select     SubCategory = "Select"
	Rollback   SubCategory = "Rollback"
	Update     SubCategory = "Update"
	Delete     SubCategory = "Delete"
	Insert     SubCategory = "Insert"

	// IO
	RemoveFile SubCategory = "RemoveFile"
	CreateFile SubCategory = "CreateFile"
	API        SubCategory = "API"
)

const (
	AppName       ExtraKey = "AppName"
	LoggerName    ExtraKey = "Logger"
	ClientIp      ExtraKey = "ClientIp"
	HostIp        ExtraKey = "HostIp"
	Method        ExtraKey = "Method"
	StatusCode    ExtraKey = "StatusCode"
	BodySize      ExtraKey = "BodySize"
	Path          ExtraKey = "Path"
	Latency       ExtraKey = "Latency"
	RequestBody   ExtraKey = "RequestBody"
	ResponseBody  ExtraKey = "ResponseBody"
	ErrorMessage  ExtraKey = "ErrorMessage"
	LatencyMicros ExtraKey = "LatencyMicros"
)
