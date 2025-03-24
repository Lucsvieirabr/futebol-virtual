<template>
  <div class="bg-white p-8 drop-shadow-md rounded-lg w-full lg:w-1/3 sm:mx-auto">
    <div class="text-center mb-7">
      <img
        src="@/assets/images/logo.webp"
        alt="Logotipo"
        class="mt-4 mb-8 h-10 mx-auto"
      >
      <div class="text-900 text-xl font-medium my-2">
        Esqueceu sua senha?
      </div>
      <div class="text-gray-600">
        Digite seu e-mail e enviaremos instruções para redefinir sua senha
      </div>
    </div>

    <div>
      <form @submit.prevent="onSubmit">
        <div class="mb-3">
          <label
            for="email"
            class="block text-900 font-medium mb-2"
          >Email</label>
          <PrimeInputText
            id="email"
            v-model="email"
            name="email"
            type="text"
            :class="{ 'p-invalid': emailError }"
            class="w-full"
          />
          <span class="p-error text-sm">{{ emailError }}</span>
          <PrimeInlineMessage
            severity="warn"
            class="w-full text-sm"
          >
            <span class="text-sm">Esqueceu seu email? Entre em contato com o suporte</span>
          </PrimeInlineMessage>
        </div>
        <PrimeButton
          type="submit"
          label="Enviar"
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
</template>

<script setup>
  import * as yup from 'yup';
  import { ptForm } from 'yup-locale-pt';
  yup.setLocale(ptForm);
    
  definePageMeta({
    layout: 'auth',
  });

  const toast = useToastCustom();
  const authRequest = useAuthRequest();

  const { handleSubmit } = useForm();
  const { value: email, errorMessage: emailError } = useField('email', yup.string().required().email());

  const loadingForm = ref(false);

  const onSubmit = handleSubmit(values => {
    loadingForm.value = true;
    authRequest.recuperarSenha(values).then((response) => {
      toast.show(Summary.Success, response.message, Severity.Success, 7000);
    }).finally(() => {
      loadingForm.value = false;
    });
  });
</script>