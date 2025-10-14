# Arquitetura Supabase - LunGo

## Visão Geral

Esta documentação descreve a arquitetura limpa implementada para integração com o Supabase no projeto LunGo.

## Estrutura de Arquivos

```
src/
├── types/
│   └── supabase.ts          # Tipos TypeScript para todas as tabelas
├── services/
│   └── supabase.ts          # Serviços para operações do Supabase
├── hooks/
│   └── useSupabaseData.ts   # Hooks personalizados para React
├── utils/
│   └── exerciseUtils.ts      # Utilitários para formatação de dados
└── app/(dashboard)/dashboard/components/
    └── Sections.tsx          # Componente atualizado
```

## Tabelas do Supabase

### 1. exercises

- **Propósito**: Biblioteca mestra de exercícios
- **Campos**: id, name, description, video_url, type, created_at
- **Tipos**: AEROBIC, STRENGTH, RESPIRATORY

### 2. workout_plan_templates

- **Propósito**: Planos de treinamento padrão
- **Campos**: id, name, target_disease, description, created_at

### 3. template_exercises

- **Propósito**: Exercícios que compõem cada template
- **Campos**: id, template_id, exercise_id, day_of_week, order_in_day, sets, reps, duration_minutes, rest_seconds

### 4. patient_plans

- **Propósito**: Planos atribuídos a pacientes específicos
- **Campos**: id, patient_id, professional_id, plan_name, is_active, start_date, notes, created_at, updated_at

### 5. scheduled_exercises

- **Propósito**: Exercícios agendados para pacientes
- **Campos**: id, patient_plan_id, exercise_id, day_of_week, order_in_day, sets, reps, duration_minutes, rest_seconds

### 6. patient_activity_logs

- **Propósito**: Registro histórico de exercícios concluídos
- **Campos**: id, patient_id, exercise_id, scheduled_exercise_id, completed_at, notes, perceived_difficulty, created_at

## Serviços Implementados

### ExerciseService

- `getAll(filters?)`: Busca todos os exercícios
- `getById(id)`: Busca exercício por ID
- `getByType(type)`: Busca exercícios por tipo

### WorkoutPlanTemplateService

- `getAll()`: Busca todos os templates
- `getById(id)`: Busca template por ID
- `getByTargetDisease(disease)`: Busca templates por doença

### PatientPlanService

- `getByPatientId(patientId, filters?)`: Busca planos do paciente
- `getActivePlan(patientId)`: Busca plano ativo
- `getPlanWithExercises(planId)`: Busca plano com exercícios

### ScheduledExerciseService

- `getByPatientPlanId(patientPlanId)`: Busca exercícios agendados
- `getByPatientIdAndDay(patientId, dayOfWeek)`: Busca exercícios por dia
- `getTodayExercises(patientId)`: Busca exercícios de hoje

### DashboardService

- `getPatientDashboardData(patientId)`: Busca todos os dados do dashboard

### PatientActivityLogService

- `create(data)`: Cria um novo log de atividade
- `getByPatientId(patientId)`: Busca histórico de atividades do paciente
- `getByPatientIdAndDate(patientId, date)`: Busca atividades por data
- `getTodayActivities(patientId)`: Busca atividades de hoje
- `getByExerciseId(patientId, exerciseId)`: Busca histórico de um exercício específico
- `updateLog(logId, updates)`: Atualiza um log existente
- `deleteLog(logId)`: Remove um log

## Hooks Personalizados

### usePatientDashboard(patientId)

- **Retorna**: Dados completos do dashboard
- **Inclui**: Plano ativo, exercícios de hoje, todos os exercícios, loading, error, summary

### useTodayExercises(patientId)

- **Retorna**: Exercícios específicos de hoje
- **Inclui**: Lista de exercícios, loading, error, refetch

### useActivePatientPlan(patientId)

- **Retorna**: Plano ativo do paciente
- **Inclui**: Plano, loading, error, refetch

### useExerciseCompletion()

- **Retorna**: Estado de exercícios completados
- **Inclui**: completedExercises, markExerciseComplete, isExerciseCompleted, etc.

### useExerciseCompletion() (Novo)

- **Retorna**: Funcionalidade para salvar conclusão no banco
- **Inclui**: isCompleting, completionError, completeExercise, clearError

### useActivityHistory(patientId)

- **Retorna**: Histórico de atividades do paciente
- **Inclui**: activities, loading, error, refetch, getTodayActivities, getActivitiesByDate

### useExercises(filters?)

- **Retorna**: Lista de exercícios do banco de dados
- **Inclui**: exercises, loading, error, refetch, getExercisesByType, searchExercises

### useUserPlanStatus(patientId)

- **Retorna**: Status do plano do usuário
- **Inclui**: hasActivePlan, activePlan, loading, error, refetch

## Utilitários

### exerciseUtils.ts

- `formatScheduledExercisesForToday()`: Converte dados do Supabase para formato do componente
- `generateTasksForExercise()`: Gera tarefas baseadas no tipo de exercício
- `formatDuration()`: Formata duração em minutos
- `formatReps()`: Formata repetições
- `calculateTotalDuration()`: Calcula duração total
- `generateExerciseSummary()`: Gera resumo de exercícios

## Configuração

### Variáveis de Ambiente Necessárias

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### Instalação de Dependências

```bash
npm install @supabase/supabase-js
```

## Segurança (RLS)

O sistema implementa Row-Level Security (RLS) com as seguintes políticas:

- **Pacientes**: Podem apenas ler seus próprios planos e exercícios
- **Profissionais**: Têm controle total sobre todas as tabelas
- **Dados públicos**: Exercícios e templates podem ser lidos por qualquer usuário

## Uso no Componente

```tsx
// Exemplo de uso no componente
export function RemindersAndActivities({ userData }: SectionsProps) {
  const {
    todayExercises,
    loading: exercisesLoading,
    error: exercisesError,
    summary,
  } = usePatientDashboard(userData?.id || "");

  const { markExerciseComplete, isExerciseCompleted } = useExerciseCompletion();

  // ... resto do componente
}
```

## Benefícios da Arquitetura

1. **Separação de Responsabilidades**: Cada arquivo tem uma responsabilidade específica
2. **Reutilização**: Hooks e serviços podem ser reutilizados em outros componentes
3. **Tipagem Forte**: TypeScript garante type safety em toda a aplicação
4. **Manutenibilidade**: Código organizado e fácil de manter
5. **Testabilidade**: Cada camada pode ser testada independentemente
6. **Performance**: Hooks otimizados com useCallback e useEffect
7. **Error Handling**: Tratamento de erros consistente em toda a aplicação

## Solução de Problemas

### Erro PGRST108 - "patient_plan is not an embedded resource"

**Problema**: Ao tentar filtrar `scheduled_exercises` por `patient_plan.patient_id`, o Supabase retorna erro PGRST108.

**Causa**: Tentativa de filtrar por uma tabela relacionada sem incluí-la no `select`.

**Solução Implementada**:

1. Primeiro buscar o plano ativo do paciente
2. Depois buscar os exercícios agendados usando o `patient_plan_id` diretamente

```typescript
// ❌ Query que falha
.eq("patient_plan.patient_id", patientId)

// ✅ Solução implementada
const activePlan = await PatientPlanService.getActivePlan(patientId);
.eq("patient_plan_id", activePlan.id)
```

### Testando a Conexão

Use o arquivo `src/utils/supabaseTest.ts` para testar a conexão:

```typescript
import { testSupabaseConnection, testPatientData } from "@/utils/supabaseTest";

// Testar conexão geral
await testSupabaseConnection();

// Testar dados específicos do paciente
await testPatientData("17797c71-0671-4590-9299-f4c13bb610de");
```

## Otimizações Implementadas

### 🚀 Cache e Performance

1. **Contexto Compartilhado**: Criado `DashboardContext` para compartilhar dados entre componentes
2. **Cache em Memória**: Implementado `useSupabaseCache` para evitar chamadas duplicadas
3. **Monitor de Rede**: Sistema de monitoramento para debug de requisições

### 📊 Estrutura Otimizada

```
src/
├── contexts/
│   └── DashboardContext.tsx    # Contexto para compartilhar dados
├── hooks/
│   ├── useSupabaseData.ts      # Hooks otimizados com cache
│   └── useSupabaseCache.ts     # Sistema de cache
└── utils/
    └── networkMonitor.ts       # Monitor de requisições
```

### 🔧 Como Usar

```tsx
// No componente pai
<DashboardProvider userData={userData}>
  <RemindersAndActivities userData={userData} />
  <Infographics userData={userData} />
</DashboardProvider>;

// Nos componentes filhos
const { todayExercises, loading } = useDashboard();
```

### 📈 Benefícios

- ✅ **Redução de 75% nas chamadas**: De 4 chamadas para 1 por carregamento
- ✅ **Cache inteligente**: Dados ficam em cache por 30 segundos
- ✅ **Reutilização de promises**: Evita chamadas simultâneas duplicadas
- ✅ **Monitoramento**: Logs detalhados para debug

## 🎯 Funcionalidades de Conclusão de Exercícios

### ✅ Sistema Completo Implementado

1. **Salvamento no Banco**: Exercícios concluídos são salvos na tabela `patient_activity_logs`
2. **Dados Coletados**: Notas, dificuldade percebida (1-5), dados vitais
3. **Feedback Visual**: Estados de loading, sucesso e erro
4. **Validação**: Verificação de dados antes de salvar
5. **Histórico**: Hook para buscar histórico de atividades

### 📊 Dados Salvos

```typescript
interface PatientActivityLog {
  id: number;
  patient_id: string;
  exercise_id: number;
  scheduled_exercise_id?: number;
  completed_at: string; // Data de conclusão
  notes?: string; // Observações do paciente
  perceived_difficulty?: number; // 1-5 (fácil a difícil)
  created_at: string;
}
```

### 🔄 Fluxo de Conclusão

1. **Usuário clica "Iniciar"** → Abre modal do exercício
2. **Preenche dados** → Notas, dificuldade, dados vitais
3. **Clica "Concluir"** → Salva no banco via `PatientActivityLogService`
4. **Feedback visual** → Toast de sucesso/erro
5. **Estado atualizado** → Exercício marcado como concluído
6. **Recarregamento automático** → Dados atualizados do banco

### 🎯 Status de Conclusão Persistente

**Problema Resolvido**: Exercícios não apareciam como concluídos após recarregar a página.

**Solução Implementada**:

1. **Busca dupla**: Carrega exercícios agendados + logs de atividade concluídos
2. **Comparação inteligente**: Compara `exercise_id` para determinar status
3. **Status persistente**: Exercícios concluídos permanecem marcados após reload

```typescript
// Lógica de comparação
const exercisesWithStatus = addCompletionStatusToExercises(
  scheduledExercises, // Exercícios agendados para hoje
  completedToday // Logs de atividades concluídas hoje
);
```

### 🛠️ Como Usar

```tsx
// No componente
const { completeExercise, isCompleting, completionError } =
  useExerciseCompletion();

// Ao concluir exercício
await completeExercise(patientId, exerciseId, scheduledExerciseId, {
  notes: "Foi difícil mas consegui!",
  perceived_difficulty: 4,
  heartRate: "85 bpm",
});
```

## 🏃‍♂️ Página de Exercícios Atualizada

### ✅ Funcionalidades Implementadas

1. **Dados Reais do Banco**: Página agora busca exercícios da tabela `exercises`
2. **Filtros Funcionais**: Categorias (Respiratórios, Aeróbicos, Força) baseadas no tipo do banco
3. **Busca em Tempo Real**: Pesquisa por nome e descrição dos exercícios
4. **Loading States**: Indicadores visuais durante carregamento
5. **Tratamento de Erros**: Mensagens de erro e botão de retry
6. **Estados Vazios**: Mensagens quando não há exercícios ou resultados

### 🔄 Mapeamento de Tipos

```typescript
// Banco de Dados → Interface
RESPIRATORY → "respiratorios"
AEROBIC     → "aerobicos"
STRENGTH    → "força"
```

### 🎨 Interface Atualizada

- ✅ **Loading**: Spinner animado durante carregamento
- ✅ **Erro**: Mensagem de erro com botão "Tentar Novamente"
- ✅ **Vazio**: Mensagem quando não há exercícios na categoria
- ✅ **Busca**: Resultado vazio com opção de limpar busca
- ✅ **Thumbnails**: Imagens baseadas no tipo do exercício

### 🧪 Como Testar

```javascript
// No console do navegador
await testExercisesPage();
```

## 🎬 Modal de Exercícios Implementado

### ✅ Funcionalidades Implementadas

1. **Categoria "TODOS"**: Nova aba que mostra todos os exercícios
2. **Modal Interativo**: Abre ao clicar em qualquer exercício
3. **Reprodução de Vídeo**: Player HTML5 integrado no modal
4. **Informações Detalhadas**: Tipo, duração, nível, ID do exercício
5. **Interface Responsiva**: Modal adaptável para diferentes telas

### 🎨 Interface do Modal

#### **Cabeçalho do Modal**

- 🎥 **Vídeo**: Player HTML5 com controles
- 🖼️ **Fallback**: Placeholder quando vídeo não disponível
- ❌ **Fechar**: Botão X no canto superior direito

#### **Conteúdo do Modal**

- 📝 **Título**: Nome do exercício
- 📄 **Descrição**: Texto explicativo do exercício
- 📊 **Informações**: Cards com tipo, duração, nível, ID
- 🎮 **Ações**: Botões "Fechar" e "Iniciar Exercício"

### 🔄 Fluxo de Funcionamento

1. **Navegação**: Usuário clica na aba "Todos" ou categoria específica
2. **Seleção**: Clica em um exercício para abrir o modal
3. **Visualização**: Modal exibe vídeo e informações do exercício
4. **Interação**: Pode reproduzir vídeo e ver detalhes
5. **Ação**: Pode fechar ou iniciar o exercício

### 🎯 Estados do Modal

#### **Com Vídeo**

```html
<video controls poster="thumbnail">
  <source src="video.mp4" type="video/mp4" />
</video>
```

#### **Sem Vídeo**

```
🎥 Vídeo não disponível
```

### 🧪 Como Testar

```javascript
// No console do navegador
await testExerciseModal();
```

## 📱 Layout Mobile Responsivo

### ✅ Melhorias Implementadas

1. **Layout Flexível**: Cards de exercício se adaptam ao mobile
2. **Botão Full-Width**: Botões ocupam toda a largura no mobile
3. **Stack Vertical**: Conteúdo empilhado verticalmente em telas pequenas
4. **Espaçamento Otimizado**: Padding e gaps ajustados para mobile

### 🎨 Comportamento Responsivo

#### **Desktop (≥ 768px)**

```
[Ícone] [Título + Detalhes] ————————————— [Botão]
```

#### **Mobile (< 768px)**

```
[Ícone] [Título + Detalhes]
[—————————— Botão ——————————]
```

### 🔧 Estilos Aplicados

#### **ExerciseCard**

```css
@media (max-width: 768px) {
  flex-direction: column;
  align-items: stretch;
  gap: 12px;
}
```

#### **ExerciseButton**

```css
@media (max-width: 768px) {
  width: 100%;
  padding: 12px 16px;
  font-size: 14px;
}
```

#### **ExerciseContent**

```css
@media (max-width: 768px) {
  flex: none;
}
```

### 🧪 Como Testar

```javascript
// No console do navegador
await testMobileLayout();

// Simular diferentes tamanhos de tela
await simulateScreenSize(375); // iPhone
await simulateScreenSize(768); // Tablet
```

## 🎬 Modal de Exercício Responsivo

### ✅ Melhorias Implementadas

1. **Modal Adaptável**: Tamanho e padding ajustados para mobile
2. **Contador Otimizado**: Tamanho reduzido de 120px para 80px no mobile
3. **Título Responsivo**: Fonte reduzida de 32px para 24px no mobile
4. **Timer Compacto**: Display reduzido de 64px para 48px no mobile
5. **Grid de Inputs**: Layout em coluna única no mobile
6. **Espaçamento Otimizado**: Padding e gaps reduzidos para mobile

### 🎨 Comportamento Responsivo

#### **Desktop (≥ 768px)**

- Modal: 800px max-width, padding 40px
- Título: 32px
- Contador: 120px
- Timer: 64px
- Grid: 2+ colunas

#### **Mobile (< 768px)**

- Modal: 95vh height, padding 20px
- Título: 24px
- Contador: 80px
- Timer: 48px
- Grid: 1 coluna

### 🔧 Estilos Aplicados

#### **ModalContent**

```css
@media (max-width: 768px) {
  height: 95vh;
  margin: 10px;
  width: calc(100% - 20px);
  border-radius: 16px;
}
```

#### **ExerciseTitle**

```css
@media (max-width: 768px) {
  font-size: 24px;
}
```

#### **CountdownNumber**

```css
@media (max-width: 768px) {
  font-size: 80px;
  transform: scale(1.1);
}
```

#### **TimerDisplay**

```css
@media (max-width: 768px) {
  font-size: 48px;
}
```

#### **DataInputsGrid**

```css
@media (max-width: 768px) {
  grid-template-columns: 1fr;
  gap: 12px;
}
```

### 🧪 Como Testar

```javascript
// No console do navegador
await testModalResponsive();

// Testar modal em diferentes tamanhos de tela
await testModalAtScreenSize(375); // iPhone
await testModalAtScreenSize(768); // Tablet
```

## 👑 Sistema de Status do Plano

### ✅ Funcionalidades Implementadas

1. **Verificação Automática**: Sidebar verifica se usuário tem plano ativo
2. **Interface Dinâmica**: Mostra mensagem diferente baseada no status
3. **Hook Personalizado**: `useUserPlanStatus` para gerenciar estado
4. **Feedback Visual**: Ícones e cores diferentes para cada estado

### 🎨 Estados da Interface

#### **Sem Plano Ativo** (Estado Original)

- 🚀 **Título**: "Upgrade para PRO"
- 📝 **Descrição**: "Acesso completo a todos os recursos"
- 🔵 **Botão**: "Assinar Agora" (azul)
- 🔗 **Ação**: Redireciona para `/subscription`

#### **Com Plano Ativo** (Novo Estado)

- 👑 **Título**: "Parabéns! Você já é um usuário Plus"
- 📝 **Descrição**: "Aproveite todos os recursos disponíveis"
- 🟢 **Botão**: "Ver Perfil" (verde)
- 🔗 **Ação**: Redireciona para `/dashboard/profile`

### 🔄 Fluxo de Funcionamento

1. **Carregamento**: Hook verifica se usuário tem plano ativo
2. **Verificação**: Consulta tabela `patient_plans` com `is_active = true`
3. **Renderização**: Mostra interface apropriada baseada no resultado
4. **Interação**: Botão leva para página correta

### 🧪 Como Testar

```javascript
// No console do navegador
await testPlanStatus("patient-id");
```

## Próximos Passos

1. Implementar React Query para cache mais robusto
2. Adicionar testes unitários para serviços e hooks
3. Implementar paginação para grandes volumes de dados
4. Adicionar modal de detalhes do exercício
5. Implementar funcionalidade de "Iniciar" exercício
6. Implementar sincronização offline
7. Adicionar retry automático para falhas de rede
