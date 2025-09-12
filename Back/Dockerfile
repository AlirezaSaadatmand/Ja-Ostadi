FROM golang:1.24.2-alpine

WORKDIR /app

# Copy go modules and download dependencies
COPY go.mod go.sum ./
RUN go mod download

# Copy source code
COPY . .

# Build
RUN go build -o server .

# Expose the port your app listens on
EXPOSE 3003

# Run the server
CMD ["./server"]
