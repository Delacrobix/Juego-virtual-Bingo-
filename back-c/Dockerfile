FROM mcr.microsoft.com/dotnet/sdk:6.0-focal

WORKDIR /backend/dotnet

COPY BingoBackend/*.csproj .
COPY /BingoBackend/appsettings.json ./

RUN dotnet restore
RUN dotnet dev-certs https --trust

COPY . .

EXPOSE 7006
EXPOSE 5100

ENTRYPOINT dotnet watch run --urls=http://+:5100;http://+:7006 --project BingoBackend.csproj