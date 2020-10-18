FROM mcr.microsoft.com/dotnet/core/aspnet:3.1 AS base
WORKDIR /app
EXPOSE 80
EXPOSE 443

ARG project_id
ARG private_key_id
ARG private_key
ARG client_email
ARG client_id
ARG client_x509_cert_url

ENV project_id $project_id
ENV private_key_id $private_key_id
ENV private_key $private_key
ENV client_email $client_email
ENV client_id $client_id
ENV client_x509_cert_url $client_x509_cert_url

FROM mcr.microsoft.com/dotnet/core/sdk:3.1 AS build
WORKDIR /src
COPY ["webappApi.csproj", "./"]
RUN dotnet restore "./webappApi.csproj"
COPY . .
WORKDIR "/src/."
RUN dotnet build "webappApi.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "webappApi.csproj" -c Release -o /app/publish

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "webappApi.dll"]
