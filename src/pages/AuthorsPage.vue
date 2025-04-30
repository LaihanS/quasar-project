<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { AuthorModel, loadAuthorModel, mapAuthorValues } from 'models';
import { $AuthorsApi } from 'api';

export interface AuthorProps {
  AuthorValues?: AuthorModel;
  modelValue?: AuthorModel;
}

const props = withDefaults(defineProps<AuthorProps>(), {
  modelValue: () => loadAuthorModel(),
});
const emits = defineEmits(['update:modelValue']);

const model = ref<AuthorModel>({ ...props.modelValue });

const authors = ref<AuthorModel[]>([]);
const selectedAuthor = ref<AuthorModel | null>(null);
const isEditMode = ref(false);

const isModalOpen = ref(false);
const authorInModal = ref<AuthorModel | null>(null);

const fetchAllAuthors = async () => {
  try {
    const { data } = await $AuthorsApi.apiAuthorsGetAuthorsGet();
    authors.value = data.map((element) =>
      mapAuthorValues.from.MapFromApiToCustom(element, loadAuthorModel())
    );
  } catch (err) {
    console.error('Error fetching authors:', err);
  }
};

const createAuthor = async () => {
  try {
    const authorDto = mapAuthorValues.to.MapFromCustomToApi(model.value);
    await $AuthorsApi.apiAuthorsPostAuthorPost({ authorDto });
    await fetchAllAuthors();
    model.value = loadAuthorModel();
  } catch (err) {
    console.error('Error al crear autor:', err);
  }
};

const updateAuthor = async () => {
  if (!selectedAuthor.value) return;
  try {
    const authorDto = mapAuthorValues.to.MapFromCustomToApi(model.value);
    await $AuthorsApi.apiAuthorsPutAuthorIdPut({
      id: selectedAuthor.value.id ?? 0,
      authorDto,
    });
    await fetchAllAuthors();
    cancelEdit();
  } catch (err) {
    console.error('Error al actualizar autor:', err);
  }
};

const deleteAuthor = async (id: number) => {
  try {
    await $AuthorsApi.apiAuthorsDeleteAuthorIdDelete({ id });
    await fetchAllAuthors();
  } catch (err) {
    console.error('Error al eliminar autor:', err);
  }
};

const editAuthor = (author: AuthorModel) => {
  model.value = { ...loadAuthorModel(), ...author };
  selectedAuthor.value = author;
  isEditMode.value = true;
};

const cancelEdit = () => {
  selectedAuthor.value = null;
  isEditMode.value = false;
  model.value = loadAuthorModel();
};

const showAuthorDetails = (author: AuthorModel) => {
  authorInModal.value = author;
  isModalOpen.value = true;
};

onMounted(fetchAllAuthors);
</script>

<template>
  <div class="q-pa-md">
    <q-card flat bordered>
      <q-card-section>
        <div class="text-h6">
          {{ isEditMode ? 'Editar Autor' : 'Nuevo Autor' }}
        </div>

        <q-input v-model="model.firstName" label="Nombre" class="q-mb-sm" />
        <q-input v-model="model.lastName" label="Apellido" class="q-mb-md" />
        <q-input
          v-model="model.idBook"
          label="ID del Libro"
          type="number"
          class="q-mb-md"
        />

        <q-btn
          :label="isEditMode ? 'Actualizar' : 'Crear'"
          color="primary"
          @click="isEditMode ? updateAuthor() : createAuthor()"
        />
        <q-btn
          v-if="isEditMode"
          label="Cancelar"
          flat
          color="secondary"
          @click="cancelEdit"
          class="q-ml-sm"
        />
      </q-card-section>

      <q-separator />

      <q-card-section>
        <q-list bordered separator>
          <q-item
            v-for="(author, index) in authors"
            :key="index"
            clickable
            @click="showAuthorDetails(author)"
          >
            <q-item-section>
              <q-item-label>
                <b>{{ author.firstName }} {{ author.lastName }}</b>
              </q-item-label>
              <q-item-label caption>ID Libro: {{ author.idBook }}</q-item-label>
            </q-item-section>

            <q-item-section side>
              <q-btn
                icon="edit"
                flat
                round
                color="primary"
                @click.stop="editAuthor(author)"
              />
              <q-btn
                icon="delete"
                flat
                round
                color="negative"
                @click.stop="deleteAuthor(author.id ?? 0)"
              />
            </q-item-section>
          </q-item>
        </q-list>
      </q-card-section>
    </q-card>

    <q-dialog v-model="isModalOpen">
      <q-card style="min-width: 350px; max-width: 90vw">
        <q-card-section>
          <div class="text-h6">Detalles del Autor</div>
        </q-card-section>

        <q-separator />

        <q-card-section>
          <div><strong>Nombre:</strong> {{ authorInModal?.firstName }}</div>
          <div><strong>Apellido:</strong> {{ authorInModal?.lastName }}</div>
          <div><strong>ID del Libro:</strong> {{ authorInModal?.idBook }}</div>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Cerrar" color="primary" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>
