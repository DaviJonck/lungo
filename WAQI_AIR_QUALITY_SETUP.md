# 🌬️ WAQI Air Quality API - Completamente Gratuita!

## ✅ **Vantagens da WAQI API**

- **100% GRATUITA** - Sem necessidade de cartão de crédito
- **Sem limites** para uso básico
- **Dados em tempo real** de estações ao redor do mundo
- **Fácil integração** - Apenas uma URL
- **Dados precisos** de organizações governamentais

## 🚀 **Como Funciona**

A WAQI (World Air Quality Index) é uma organização sem fins lucrativos que coleta dados de qualidade do ar de estações oficiais ao redor do mundo.

### **Token Demo**

- Usa `token=demo` para testes
- Para produção, registre-se em [waqi.info](https://aqicn.org/api/) para token personalizado

## 📊 **Dados Fornecidos**

### **Informações Principais:**

- **AQI (Air Quality Index)**: Índice de 0-500+
- **Cidade**: Nome da localização
- **Poluentes Individuais**: PM2.5, PM10, O3, NO2, SO2, CO
- **Atribuições**: Fonte dos dados (EPA, CETESB, etc.)

### **Categorias AQI:**

- **0-50**: Boa (Verde)
- **51-100**: Moderada (Amarelo)
- **101-150**: Ruim para Sensíveis (Laranja)
- **151-200**: Ruim (Vermelho)
- **201-300**: Muito Ruim (Roxo)
- **300+**: Perigosa (Marrom)

## 🔧 **Implementação Atual**

### **API Endpoint:**

```
GET /api/air-quality?lat=-23.5505&lon=-46.6333
```

### **Resposta da API:**

```json
{
  "aqi": 85,
  "status": "Moderada",
  "color": "#f59e0b",
  "description": "Qualidade do ar aceitável",
  "category": "MODERATE",
  "dominantPollutant": "pm25",
  "components": {
    "pm25": { "v": 25.5 },
    "pm10": { "v": 35.2 },
    "o3": { "v": 45.1 }
  },
  "recommendations": [
    "Adequado para atividades ao ar livre",
    "Pessoas sensíveis devem ter cuidado"
  ],
  "location": {
    "city": "São Paulo",
    "latitude": -23.5505,
    "longitude": -46.6333
  },
  "attributions": [
    {
      "name": "CETESB",
      "url": "https://cetesb.sp.gov.br"
    }
  ],
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

## 🌍 **Cobertura Global**

A WAQI tem dados de:

- **Brasil**: CETESB, INEA, FEAM
- **EUA**: EPA
- **Europa**: EEA
- **Ásia**: Governos locais
- **E mais**: 10,000+ estações em 100+ países

## 📱 **Integração no Dashboard**

O componente `AirQualityCard` já está integrado e mostra:

1. **Status Visual**: Cores baseadas no AQI
2. **Informações da Cidade**: Nome e AQI atual
3. **Poluente Dominante**: Qual está mais presente
4. **Recomendações**: Sugestões para exercícios
5. **Métricas**: AQI e categoria

## 🔄 **Atualização Automática**

- **Dados em tempo real** das estações oficiais
- **Atualização automática** a cada carregamento
- **Cache inteligente** para evitar muitas requisições

## 🛠️ **Configuração Avançada (Opcional)**

### **Token Personalizado:**

1. Registre-se em [waqi.info](https://aqicn.org/api/)
2. Obtenha seu token pessoal
3. Substitua `token=demo` por `token=SEU_TOKEN`

### **Limites com Token Personalizado:**

- **1,000 requests/dia** gratuitos
- **$0.50 por 1,000 requests** adicionais

## 🆚 **Comparação com Outras APIs**

| API         | Custo       | Limites        | Dados         | Facilidade     |
| ----------- | ----------- | -------------- | ------------- | -------------- |
| **WAQI**    | ✅ Gratuita | ✅ Sem limites | ✅ Excelentes | ✅ Muito fácil |
| Google      | ❌ $0.50/1k | ❌ 1k/mês      | ✅ Excelentes | ❌ Complexa    |
| OpenWeather | ✅ Gratuita | ❌ 1k/dia      | ⚠️ Básicos    | ⚠️ Média       |

## 🎯 **Benefícios para LunGo**

1. **Sem custos** - Ideal para MVP e desenvolvimento
2. **Dados confiáveis** - Fontes governamentais oficiais
3. **Cobertura global** - Funciona em qualquer lugar
4. **Fácil manutenção** - Sem configurações complexas
5. **Dados precisos** - Especialmente importante para usuários respiratórios

## 🚨 **Troubleshooting**

### **Erro: "Dados não disponíveis"**

- Verifique se as coordenadas estão corretas
- Algumas áreas podem não ter estações próximas

### **Erro: "API não responde"**

- WAQI pode estar temporariamente indisponível
- Tente novamente em alguns minutos

### **Dados desatualizados**

- Estações podem ter intervalos de atualização diferentes
- Dados são atualizados conforme disponibilidade das estações

## 📈 **Monitoramento**

Para monitorar o uso:

- **Sem token**: Sem limites, mas sem métricas
- **Com token**: Dashboard em [waqi.info](https://aqicn.org/api/)

## 🎉 **Conclusão**

A WAQI API é perfeita para o LunGo porque:

- ✅ **Completamente gratuita**
- ✅ **Sem necessidade de cartão**
- ✅ **Dados confiáveis e precisos**
- ✅ **Fácil de implementar**
- ✅ **Cobertura global**

**Pronto para usar!** 🚀
