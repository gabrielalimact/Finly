/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

const tintColorLight = '#88C0A7'; // Verde menta suave, conforme seu tema
const tintColorDark = '#fff';

export const Colors = {
  light: {
    text: '#2E2E2E',           // Texto escuro, como no seu tema principal
    textSecondary: '#687076',  // Texto secundário, tom acinzentado suave
    background: '#FAFAFB',     // Fundo bem claro, quase branco
    card: '#FFFFFF',           // Cartões brancos
    border: '#E4E4E7',         // Bordas suaves e claras
    notification: '#F2A1A1',   // Tom pastel para alertas/erros

    tint: tintColorLight,      // Verde menta suave para highlights e botões
    icon: '#687076',           // Ícones em cinza médio
    tabIconDefault: '#A3B8AA', // Ícone padrão com verde acinzentado claro
    tabIconSelected: tintColorLight, // Ícone selecionado na cor primária
    
    success: '#A3D9B1',        // Verde claro pastel para mensagens de sucesso
    warning: '#F2C57C',        // Amarelo pastel para avisos
    info: '#88BFD6',           // Azul pastel para informações

    overlay: 'rgba(136, 192, 167, 0.1)', // Sobreposição suave em verde menta translúcido
    shadow: 'rgba(46, 46, 46, 0.1)',     // Sombra leve para elementos
  },
  dark: {
    text: '#ECEDEE',
    background: '#151718',
    tint: tintColorDark,
    icon: '#9BA1A6',
    tabIconDefault: '#9BA1A6',
    tabIconSelected: tintColorDark,
  },
};
