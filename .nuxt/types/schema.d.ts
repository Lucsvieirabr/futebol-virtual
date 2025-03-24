import { NuxtModule, RuntimeConfig } from 'nuxt/schema'
declare module 'nuxt/schema' {
  interface NuxtConfig {
    ["tailwindcss"]?: typeof import("@nuxtjs/tailwindcss").default extends NuxtModule<infer O> ? Partial<O> : Record<string, any>
    ["primevue"]?: typeof import("nuxt-primevue").default extends NuxtModule<infer O> ? Partial<O> : Record<string, any>
    ["veeValidate"]?: typeof import("@vee-validate/nuxt").default extends NuxtModule<infer O> ? Partial<O> : Record<string, any>
    ["eslint"]?: typeof import("@nuxtjs/eslint-module").default extends NuxtModule<infer O> ? Partial<O> : Record<string, any>
    ["devtools"]?: typeof import("@nuxt/devtools").default extends NuxtModule<infer O> ? Partial<O> : Record<string, any>
    ["telemetry"]?: typeof import("@nuxt/telemetry").default extends NuxtModule<infer O> ? Partial<O> : Record<string, any>
    modules?: (undefined | null | false | NuxtModule | string | [NuxtModule | string, Record<string, any>] | ["@nuxtjs/tailwindcss", Exclude<NuxtConfig["tailwindcss"], boolean>] | ["nuxt-primevue", Exclude<NuxtConfig["primevue"], boolean>] | ["@vee-validate/nuxt", Exclude<NuxtConfig["veeValidate"], boolean>] | ["@nuxtjs/eslint-module", Exclude<NuxtConfig["eslint"], boolean>] | ["@nuxt/devtools", Exclude<NuxtConfig["devtools"], boolean>] | ["@nuxt/telemetry", Exclude<NuxtConfig["telemetry"], boolean>])[],
  }
  interface RuntimeConfig {
   app: {
      baseURL: string,

      buildAssetsDir: string,

      cdnURL: string,
   },
  }
  interface PublicRuntimeConfig {
   apiBase: string,

   primevue: {
      usePrimeVue: boolean,

      resolvePath: any,

      cssLayerOrder: string,

      importPT: any,

      options: {
         ripple: boolean,

         locale: {
            startsWith: string,

            contains: string,

            notContains: string,

            endsWith: string,

            equals: string,

            notEquals: string,

            noFilter: string,

            filter: string,

            lt: string,

            lte: string,

            gt: string,

            gte: string,

            dateIs: string,

            dateIsNot: string,

            dateBefore: string,

            dateAfter: string,

            custom: string,

            clear: string,

            apply: string,

            close: string,

            matchAll: string,

            matchAny: string,

            addRule: string,

            removeRule: string,

            accept: string,

            reject: string,

            choose: string,

            upload: string,

            cancel: string,

            completed: string,

            pending: string,

            fileSizeTypes: Array<string>,

            dayNames: Array<string>,

            dayNamesShort: Array<string>,

            dayNamesMin: Array<string>,

            monthNames: Array<string>,

            monthNamesShort: Array<string>,

            chooseYear: string,

            chooseMonth: string,

            chooseDate: string,

            prevDecade: string,

            nextDecade: string,

            prevYear: string,

            nextYear: string,

            prevMonth: string,

            nextMonth: string,

            prevHour: string,

            nextHour: string,

            prevMinute: string,

            nextMinute: string,

            prevSecond: string,

            nextSecond: string,

            am: string,

            pm: string,

            today: string,

            now: string,

            weekHeader: string,

            firstDayOfWeek: number,

            showMonthAfterYear: boolean,

            dateFormat: string,

            weak: string,

            medium: string,

            strong: string,

            passwordPrompt: string,

            emptyFilterMessage: string,

            searchMessage: string,

            selectionMessage: string,

            emptySelectionMessage: string,

            emptySearchMessage: string,

            emptyMessage: string,

            aria: {
               trueLabel: string,

               falseLabel: string,

               nullLabel: string,

               star: string,

               stars: string,

               selectAll: string,

               unselectAll: string,

               close: string,

               previous: string,

               next: string,

               navigation: string,

               scrollTop: string,

               moveTop: string,

               moveUp: string,

               moveDown: string,

               moveBottom: string,

               moveToTarget: string,

               moveToSource: string,

               moveAllToTarget: string,

               moveAllToSource: string,

               pageLabel: string,

               firstPageLabel: string,

               lastPageLabel: string,

               nextPageLabel: string,

               previousPageLabel: string,

               rowsPerPageLabel: string,

               jumpToPageDropdownLabel: string,

               jumpToPageInputLabel: string,

               selectRow: string,

               unselectRow: string,

               expandRow: string,

               collapseRow: string,

               showFilterMenu: string,

               hideFilterMenu: string,

               filterOperator: string,

               filterConstraint: string,

               editRow: string,

               saveEdit: string,

               cancelEdit: string,

               listView: string,

               gridView: string,

               slide: string,

               slideNumber: string,

               zoomImage: string,

               zoomIn: string,

               zoomOut: string,

               rotateRight: string,

               rotateLeft: string,
            },
         },
      },

      components: Array<{

      }>,

      directives: Array<{

      }>,

      composables: Array<{

      }>,

      config: Array<{

      }>,

      services: Array<{

      }>,

      styles: Array<{

      }>,

      injectStylesAsString: Array<any>,

      injectStylesAsStringToTop: Array<string>,
   },
  }
}
declare module 'vue' {
        interface ComponentCustomProperties {
          $config: RuntimeConfig
        }
      }