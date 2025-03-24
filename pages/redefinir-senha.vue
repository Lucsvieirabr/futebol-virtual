<template>
  <CommonSplashScreen v-show="showSplashScreen" />
  <div
    v-show="!showSplashScreen && tokenValido"
    class="bg-white p-8 drop-shadow-md rounded-lg w-full lg:w-1/3 sm:mx-auto"
  >
    <div class="text-center mb-7">
      <img
        src="@/assets/images/logo.webp"
        alt="Logotipo"
        class="mt-4 mb-8 h-10 mx-auto"
      >
      <div class="text-900 text-xl font-medium my-2">
        Redefinição de Senha
      </div>
      <div class="text-gray-600">
        Geramos uma senha segura para você, mas você pode alterá-la clicando e editando o campo abaixo!
      </div>
    </div>

    <div>
      <form @submit.prevent="onSubmit">
        <div class="mb-7">
          <div class="p-inputgroup flex-1 border-solid border border-gray-300 rounded-lg">
            <PrimeInputText
              v-model="password"
              :class="{ 'p-invalid': passwordError }"
              class="border-none"
            />
            <PrimeButton
              v-tooltip.top="'Gerar senha'"
              icon="pi pi-sync"
              text
              outlined
              @click="gerarSenha()"
            />
            <PrimeButton
              v-tooltip.top="'Copiar senha'"
              icon="pi pi-copy"
              severity="secondary"
              @click="copiar()"
            />
          </div>
          <span class="p-error text-sm">{{ passwordError }}</span>
        </div>

        <PrimeButton
          type="submit"
          label="Continuar"
          class="w-full"
          :loading="loadingForm"
        />
      </form>

      <div class="text-center mt-4">
        <NuxtLink
          to="/login"
          class="font-medium no-underline ml-2 text-blue-500 text-right cursor-pointer"
        >
          Voltar para Login
        </NuxtLink>
      </div>  
    </div>
  </div>

  <div
    v-show="!showSplashScreen && !tokenValido"
    class="bg-white p-8 drop-shadow-md rounded-lg w-full lg:w-1/3 sm:mx-auto"
  >
    <div class="text-center mb-7">
      <img
        src="@/assets/images/logo.webp"
        alt="Logotipo"
        class="mt-4 mb-8 h-10 mx-auto"
      >
      <div class="text-900 text-xl font-medium my-2">
        Redefinição de Senha
      </div>
      <PrimeMessage
        severity="error"
        :closable="false"
        class="text-left"
      >
        Lamentamos, este link de redefinição de senha é inválido.
      </PrimeMessage>
    </div>

    <div>
      <div class="text-center mt-4">
        <NuxtLink to="/recuperar-senha">
          <PrimeButton
            label="Solicitar nova recuperação de Senha"
            class="w-full"
          />
        </NuxtLink>
      </div>
      <div class="text-center mt-4">
        <NuxtLink
          to="/login"
          class="font-medium no-underline ml-2 text-blue-500 text-right cursor-pointer"
        >
          Voltar para Login
        </NuxtLink>
      </div>  
    </div>
  </div>
</template>

<script setup>
  import * as yup from 'yup';
  import { ptForm } from 'yup-locale-pt';
  yup.setLocale(ptForm);

  definePageMeta({
    layout: 'auth',
  });

  const showSplashScreen = ref(true);
  const tokenValido = ref(false);
  const senhaCopiada = ref(false);
  const loadingForm = ref(false);

  const toast = useToastCustom();
  const authRequest = useAuthRequest();
  const route = useRoute();
  const { handleSubmit } = useForm();

  onBeforeMount(async () => {
    const response = await authRequest.validarTokenRedefinicao({
      token: route.query.token,
      user: route.query.user,
    });
    if (response) {
      email.value = response.email;
      token.value = route.query.token;
      tokenValido.value = true;
    }

    showSplashScreen.value = false;

  });
    
  const { value: email } = useField('email', yup.string());
  const { value: password, errorMessage: passwordError } = useField('password', yup.string().required());
  const { value: token } = useField('token', yup.string());

  const onSubmit = handleSubmit(values => {
    if (!senhaCopiada.value) {
      toast.show('Antes de continuar', 'Copie a senha gerada e guarde em um local seguro.', Severity.Error);
      return;
    }
    loadingForm.value = true;
    authRequest.redefinirSenha(values).then((response) => {
      toast.show(Summary.Success, response.message, Severity.Success);
      setTimeout(() => {
        navigateTo('/login');
      }, 1000);
    }).finally(() => {
      loadingForm.value = false;
    });
  });

  const copiar = () => {
    navigator.clipboard.writeText(password.value);
    toast.show('Senha copiada', 'Salve em um local seguro');
    senhaCopiada.value = true;
  };

  const gerarSenha = () => {
    password.value = authRequest.gerarSenha();
    senhaCopiada.value = false;
  };
  gerarSenha();

</script>