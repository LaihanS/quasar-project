<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { BookModel, loadBookModel, mapBookValues } from 'models';
import { AuthorModel, loadAuthorModel, mapAuthorValues } from 'models';
import { $BooksApi } from 'api';
import { $AuthorsApi } from 'api';

export interface BookProps {
  modelValue?: BookModel;
}

const props = withDefaults(defineProps<BookProps>(), {
  modelValue: () => loadBookModel(),
});
const emits = defineEmits(['update:modelValue']);

const model = ref<BookModel>({ ...props.modelValue });

const books = ref<BookModel[]>([]);
const authors = ref<AuthorModel[]>([]);
const selectedBook = ref<BookModel | null>(null);
const isEditMode = ref(false);

const isModalOpen = ref(false);
const bookInModal = ref<BookModel | null>(null);

const fetchAllBooks = async () => {
  try {
    const { data } = await $BooksApi.apiBooksGetBooksGet();
    books.value = data.map((element) =>
      mapBookValues.from.MapFromApiToCustom(element, loadBookModel())
    );
  } catch (err) {
    console.error('Error fetching books:', err);
  }
};

const createBook = async () => {
  try {
    const bookDto = mapBookValues.to.MapFromCustomToApi(model.value);
    await $BooksApi.apiBooksPostBookPost({ bookDto });
    await fetchAllBooks();
    model.value = loadBookModel();
  } catch (err) {
    console.error('Error al crear libro:', err);
  }
};

const updateBook = async () => {
  if (!selectedBook.value) return;
  try {
    const bookDto = mapBookValues.to.MapFromCustomToApi(model.value);
    await $BooksApi.apiBooksPutBookIdPut({
      id: selectedBook.value.id ?? 0,
      bookDto,
    });
    await fetchAllBooks();
    cancelEdit();
  } catch (err) {
    console.error('Error al actualizar libro:', err);
  }
};

const deleteBook = async (id: number) => {
  try {
    await $BooksApi.apiBooksDeleteBookIdDelete({ id });
    await fetchAllBooks();
  } catch (err) {
    console.error('Error al eliminar libro:', err);
  }
};

const editBook = (book: BookModel) => {
  model.value = { ...loadBookModel(), ...book };
  selectedBook.value = book;
  isEditMode.value = true;
};

const cancelEdit = () => {
  selectedBook.value = null;
  isEditMode.value = false;
  model.value = loadBookModel();
};

const fetchAllAuthorsByBook = async (bookId: number) => {
  try {
    const { data } = await $AuthorsApi.apiAuthorsGetAuthorsGet();
    const allAuthors = data.map((element) =>
      mapAuthorValues.from.MapFromApiToCustom(element, loadAuthorModel())
    );
    authors.value = allAuthors.filter((author) => author.idBook === bookId);
  } catch (err) {
    console.error('Error fetching authors:', err);
  }
};

const showBookDetails = (book: BookModel) => {
  bookInModal.value = book;
  isModalOpen.value = true;
  fetchAllAuthorsByBook(book.id ?? 0);
};

onMounted(fetchAllBooks);
</script>

<template>
  <div class="q-pa-md">
    <q-card flat bordered>
      <q-card-section>
        <div class="text-h6">
          {{ isEditMode ? 'Editar Libro' : 'Nuevo Libro' }}
        </div>

        <q-input v-model="model.title" label="Título" class="q-mb-sm" />
        <q-input
          v-model="model.description"
          label="Descripción"
          class="q-mb-md"
        />

        <q-btn
          :label="isEditMode ? 'Actualizar' : 'Crear'"
          color="primary"
          @click="isEditMode ? updateBook() : createBook()"
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
            v-for="(book, index) in books"
            :key="index"
            clickable
            @click="showBookDetails(book)"
          >
            <q-item-section>
              <q-item-label
                ><b>{{ book.title }}</b></q-item-label
              >
              <q-item-label caption>{{ book.description }}</q-item-label>
            </q-item-section>

            <q-item-section side>
              <q-btn
                icon="edit"
                flat
                round
                color="primary"
                @click.stop="editBook(book)"
              />
              <q-btn
                icon="delete"
                flat
                round
                color="negative"
                @click.stop="deleteBook(book.id ?? 0)"
              />
            </q-item-section>
          </q-item>
        </q-list>
      </q-card-section>
    </q-card>

    <q-dialog v-model="isModalOpen">
      <q-card style="min-width: 350px; max-width: 90vw">
        <q-card-section>
          <div class="text-h6">Detalles del Libro</div>
        </q-card-section>

        <q-separator />

        <q-card-section>
          <div><strong>Titulo:</strong> {{ bookInModal?.title }}</div>
          <div>
            <strong>Descripcion:</strong> {{ bookInModal?.description }}
          </div>
          <div>
            <strong>Cantidad de Paginas:</strong> {{ bookInModal?.pageCount }}
          </div>
          <div><strong>excerpt:</strong> {{ bookInModal?.excerpt }}</div>

          <q-separator class="q-my-md" />
          <div><strong>Autores:</strong></div>
          <ul>
            <li v-for="author in authors" :key="author.id ?? 0">
              {{ author.firstName }}
            </li>
          </ul>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Cerrar" color="primary" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>
