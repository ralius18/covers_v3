// Styles
import '@mdi/font/css/materialdesignicons.css'
import 'vuetify/styles'

// Vuetify
import { ThemeDefinition, createVuetify } from 'vuetify'
import { VDataTable } from 'vuetify/labs/VDataTable'
import { VDatePicker } from 'vuetify/lib/labs/components.mjs'

const customTheme: ThemeDefinition = {
  dark: true,
  colors: {
    primary: '#ffc107',
    'primary-lighten-1': '#ffd68c',
    'primary-lighten-2': '#ffe9c1',
    secondary: "#17a2b8",
    anchor: "#ffe9c1",
    background: '#121212',
    error: '#dd3333'
  }
}

export default createVuetify(
  // https://vuetifyjs.com/en/introduction/why-vuetify/#feature-guides
  {
    theme: {
      defaultTheme: 'customTheme',
      themes: {
        customTheme
      }
    },
    components: {
      VDataTable,
      VDatePicker
    }
  }
)
