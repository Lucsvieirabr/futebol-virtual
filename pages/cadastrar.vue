<template>
  <div
    class="bg-white p-8 pb-4 drop-shadow-md rounded-lg w-full lg:w-1/3 sm:mx-auto"
  >
    <img
      src="@/assets/images/logo.webp"
      alt="Logotipo"
      class="mt-4 mb-1 h-20 mx-auto"
    >
    <PrimeStepper
      v-model:activeStep="passo_atual"
      linear
      vertical
    >
      <input
        v-model="passo_atual"
        type="hidden"
        name="passo_atual"
      >

      <!-- Passo 1 -->
      <PrimeStepperPanel header="Informações Pessoais">
        <template #content>
          <div class="text-center mb-7">
            <div class="text-900 text-xl font-medium my-2">
              Preencha seus dados
            </div>
          </div>
          <div>
            <div class="flex gap-4 mb-3">
              <div>
                <label
                  for="tipo_pessoa"
                  class="block text-900 font-medium mb-2"
                >Tipo</label>
                <PrimeDropdown
                  v-model="tipo_pessoa"
                  :options="TIPO_PESSOA_OPTIONS"
                  option-label="nome"
                  option-value="id"
                  placeholder="Selecione uma opção"
                  class="w-full"
                  :class="{ 'p-invalid': tipoPessoaError }"
                />
                <span class="p-error text-sm">{{ tipoPessoaError }}</span>
              </div>

              <div class="w-full">
                <label
                  for="cpf_cnpj"
                  class="block text-900 font-medium mb-2"
                >{{
                  cpfCnpjLabel
                }}</label>
                <PrimeInputMask
                  id="cpf_cnpj"
                  v-model="cpf_cnpj"
                  :mask="cpfCnpjMask"
                  name="cpf_cnpj"
                  type="text"
                  :class="{ 'p-invalid': cpfCnpjError }"
                  class="w-full"
                />

                <span class="p-error text-sm">{{ cpfCnpjError }}</span>
              </div>
            </div>
            <div class="mb-3">
              <label
                for="nome"
                class="block text-900 font-medium mb-2"
              >Nome/Razão Social</label>
              <PrimeInputText
                id="nome"
                v-model="nome"
                placeholder="Digite seu nome ou razão social"
                class="w-full"
                :class="{ 'p-invalid': nomeError }"
              />
              <span class="p-error text-sm">{{ nomeError }}</span>
            </div>
            <div class="mb-3">
              <label
                for="conselho"
                class="block text-900 font-medium mb-2"
              >Número do Conselho</label>
              <PrimeInputText
                id="conselho"
                v-model="numero_conselho"
                placeholder="Digite o número do conselho"
                class="w-full"
                :class="{ 'p-invalid': numeroConselhoError }"
              />
              <span class="p-error text-sm">{{ numeroConselhoError }}</span>
            </div>
          </div>
          <div class="flex pt-4 justify-between">
            <NuxtLink to="/login">
              <PrimeButton
                label="Fazer Login"
                link
              />
            </NuxtLink>
            <PrimeButton
              label="Próximo"
              @click="validarPasso1"
            />
          </div>
        </template>
      </PrimeStepperPanel>

      <!-- Passo 2 -->
      <PrimeStepperPanel header="Contato e Acesso">
        <template #content="{ prevCallback }">
          <div class="text-center mb-7">
            <div class="text-900 text-xl font-medium my-2">
              Insira seu email e telefone
            </div>
          </div>
          <div>
            <div class="mb-3">
              <label
                for="email"
                class="block text-900 font-medium mb-2"
              >Email</label>
              <PrimeInputText
                id="email"
                v-model="email"
                placeholder="Digite seu email"
                class="w-full"
                :class="{ 'p-invalid': emailError }"
              />
              <span class="p-error text-sm">{{ emailError }}</span>
            </div>
            <div class="mb-3">
              <label
                for="telefone"
                class="block text-900 font-medium mb-2"
              >Telefone</label>
              <PrimeInputMask
                id="telefone"
                v-model="telefone"
                mask="?(99) 99999-9999"
                placeholder="Digite seu telefone"
                class="w-full"
                :class="{ 'p-invalid': telefoneError }"
              />
              <span class="p-error text-sm">{{ telefoneError }}</span>
            </div>
          </div>
          <div class="flex pt-4 justify-between">
            <PrimeButton
              label="Voltar"
              link
              @click="prevCallback"
            />
            <PrimeButton
              label="Próximo"
              @click="validarPasso2"
            />
          </div>
        </template>
      </PrimeStepperPanel>

      <!-- Passo 3 -->
      <PrimeStepperPanel header="Defina sua Senha">
        <template #content="{ prevCallback }">
          <div class="text-center mb-7">
            <div class="text-900 text-xl font-medium my-2">
              Escolha uma senha segura
            </div>
          </div>
          <div class="mb-3">
            <div
              class="p-inputgroup flex-1 border-solid border border-gray-300 rounded-lg"
            >
              <PrimeInputText
                v-model="password"
                class="border-none"
                :class="{ 'p-invalid': passwordError }"
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
          <div class="flex pt-4 justify-between">
            <PrimeButton
              label="Voltar"
              link
              @click="prevCallback"
            />
            <PrimeButton
              label="Cadastrar"
              @click="concluirCadastro"
            />
          </div>
        </template>
      </PrimeStepperPanel>
    </PrimeStepper>
  </div>
  <PrimeToast />
</template>

<script setup>
  import * as yup from "yup";
  import { ptForm } from "yup-locale-pt";
  import { useCadastroFormValidation } from "~/utils/validations/auth/cadastroFormValidation";
  import {
    TIPO_PESSOA,
    TIPO_PESSOA_OPTIONS,
  } from "~/utils/constants/cadastro/tipoPessoa.js";
  yup.setLocale(ptForm);

  const authRequest = useAuthRequest();
  const toast = useToastCustom();

  definePageMeta({
    layout: "auth",
  });

  const loadingForm = ref(false);
  const senhaCopiada = ref(false);

  const isPessoaFisica = computed(() => {
    return tipo_pessoa.value === TIPO_PESSOA.FISICA.id;
  });

  const isPessoaJuridica = computed(() => {
    return tipo_pessoa.value === TIPO_PESSOA.JURIDICA.id;
  });

  const cpfCnpjLabel = computed(() => {
    return isPessoaFisica.value ? "CPF" : "CNPJ";
  });

  const cpfCnpjMask = computed(() => {
    return isPessoaFisica.value ? "999.999.999-99" : "99.999.999/9999-99";
  });
  const copiar = () => {
    navigator.clipboard.writeText(password.value);
    toast.show("Senha copiada", "Salve em um local seguro");
    senhaCopiada.value = true;
  };

  const gerarSenha = () => {
    password.value = authRequest.gerarSenha();
    senhaCopiada.value = false;
  };

  const {
    passo_atual,
    tipo_pessoa,
    cpf_cnpj,
    nome,
    numero_conselho,
    email,
    password,
    telefone,

    passoAtualError,
    tipoPessoaError,
    cpfCnpjError,
    nomeError,
    numeroConselhoError,
    emailError,
    passwordError,
    telefoneError,

    handleSubmit,
  } = useCadastroFormValidation();

  const validarPasso1 = handleSubmit(() => {
    passo_atual.value++;
  });
  const validarPasso2 = handleSubmit(() => {
    passo_atual.value++;
    gerarSenha();
  });

  const concluirCadastro = handleSubmit((values) => {
    if (!senhaCopiada.value) {
      toast.show(
        "Antes de continuar",
        "Copie a senha gerada e guarde em um local seguro.",
        Severity.Error,
      );
      return;
    }
    loadingForm.value = true;
    authRequest
      .cadastrarNovoUsuario(values)
      .then((response) => {
        toast.show(response.title, response.message, Severity.Success);
        setTimeout(() => {
          navigateTo("/login");
        }, 1000);
      })
      .catch(() => {
        loadingForm.value = false;
      });
  });

  onMounted(() => {
    passo_atual.value = 0;
    tipo_pessoa.value = TIPO_PESSOA.FISICA.id;
  });
</script>

<style>
.p-stepper-nav {
  display: none;
}
</style>
