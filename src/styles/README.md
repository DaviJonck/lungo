# Tema Styled Components

Este projeto está configurado com styled-components e um tema personalizado.

## Cores Disponíveis

- `primary`: #dff2eb
- `secondary`: #7ab2d3
- `background`: #b9e5e8
- `disabled`: #c5c0db
- `disabledLight`: #f2f8f5
- `secondaryDarker`: #4a628a
- `secondaryLighter`: #84b2ff
- `textBlack`: #212121
- `textBlue`: #4a628a
- `textValidation`: #4a628a
- `textSuccess`: #439f6e
- `textError`: #f93232
- `pink`: #f3b2b8
- `white`: #ffffff

## Fonte

- `primary`: 'Nunito Sans', sans-serif

## Como Usar

```tsx
import styled from "styled-components";

const MyComponent = styled.div`
  background-color: ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.colors.textBlack};
  font-family: ${({ theme }) => theme.fonts.primary};
  padding: ${({ theme }) => theme.spacing.md};
  border-radius: ${({ theme }) => theme.borderRadius.md};
`;
```

## Estrutura do Tema

O tema inclui:

- **colors**: Todas as cores do design system
- **fonts**: Configurações de fonte
- **fontSizes**: Tamanhos de fonte padronizados
- **spacing**: Espaçamentos consistentes
- **borderRadius**: Raios de borda padronizados
- **shadows**: Sombras padronizadas
- **breakpoints**: Breakpoints para responsividade

## Exemplo de Componente

Veja `src/components/ExampleComponent.tsx` para exemplos de como usar o tema em componentes styled-components.
