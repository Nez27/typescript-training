import EventDataTrigger from 'helpers/evDataTrigger';
import { REMOVE_CATEGORY } from '../../constants/config';
import Category from 'models/category';
import { Data, Nullable, PromiseOrNull } from 'global/types';

export default class CategoryView {
  categoryDialog: Nullable<HTMLDialogElement> = null;

  categoryField: Nullable<HTMLElement> = null;

  closeIcon: Nullable<HTMLElement> = null;

  getAllCategory: Nullable<PromiseOrNull<Category[]>> = null;

  evDataTrigger: Nullable<EventDataTrigger> = null;

  listCategory: Nullable<Category[]> = null;

  categorySelected: string;

  constructor() {
    this.categorySelected = '';

    this.categoryDialog = document.getElementById(
      'categoryDialog',
    ) as HTMLDialogElement;
    this.categoryField = document.getElementById('selectCategory');
    this.closeIcon = document.querySelector('.close-icon') as HTMLElement;

    this.handlerEventCategoryDialog();
    this.addEventSelectCategoryDialog();
  }

  initFunction(
    getAllCategory: PromiseOrNull<Category[]>,
    evDataTrigger: EventDataTrigger,
  ) {
    this.getAllCategory = getAllCategory;
    this.evDataTrigger = evDataTrigger;
  }

  sendData() {
    const data: Data = { listCategories: this.listCategory! };

    this.evDataTrigger!.onSendSignal('categoryView', data);
  }

  handlerEventCategoryDialog() {
    this.categoryDialog!.addEventListener('input', () => {
      setTimeout(() => {
        this.searchCategory();
      }, 300);
    });
  }

  /**
   * Load category data
   * @param {function} getAllCategory Get all category function
   */
  async loadCategory(): Promise<void> {
    if (!this.listCategory) {
      this.listCategory = await this.getAllCategory!();

      this.sendData();
    }

    if (this.listCategory) {
      this.renderCategoryList();
    }
  }

  searchCategory() {
    const searchCategoryEl: HTMLDataElement =
      this.categoryDialog!.querySelector("[name='category']")!;
    const searchValue = searchCategoryEl.value.trim().toLowerCase();
    let newListCategory: Category[] = [];

    if (searchValue) {
      this.listCategory!.forEach((category) => {
        const categoryName = category.name.trim().toLowerCase();

        if (categoryName.includes(searchValue)) {
          newListCategory.unshift(category);
        }
      });
    } else {
      newListCategory = this.listCategory!;
    }

    // Render category item
    this.renderCategoryList(this.categorySelected, newListCategory);
  }

  renderCategoryList(
    categorySelected?: string,
    listCategory = this.listCategory!,
  ) {
    // Remove category name unnecessary
    const newListCategory = listCategory.filter(
      (item) => !REMOVE_CATEGORY.includes(item.name),
    );

    const listCategoryEl = document.querySelector('.list-category');

    listCategoryEl!.innerHTML = ''; // Remove old category item

    newListCategory.forEach((category) => {
      const markup = `
        <div class="category-item ${
          category.name === categorySelected ? 'selected' : ''
        }" data-value='${category.name}' data-url='${category.url}'>
          <img
            class="icon-category"
            src="${category.url}"
            alt="${category.name} Icon"
          />
          <p class="name-category">${category.name}</p>
        </div>
      `;

      listCategoryEl!.insertAdjacentHTML('afterbegin', markup);
    });
  }

  addEventSelectCategoryDialog() {
    const categoryListEl = document.querySelector('.list-category');
    const categoryIconEl = this.categoryField!.querySelector(
      '.category-icon',
    ) as HTMLImageElement;
    const categoryNameEl = this.categoryField!.querySelector(
      '.category-name',
    ) as HTMLDataElement;

    categoryListEl!.addEventListener('click', (e) => {
      const categoryItem = (<Element>e.target).closest(
        '.category-item',
      ) as HTMLElement;

      if (categoryItem) {
        const { url } = categoryItem.dataset;
        const { value } = categoryItem.dataset;

        // Set url and value into category field in transaction dialog
        categoryIconEl.src = url!;
        categoryNameEl.value = value!;

        // Close select category dialog
        this.categoryDialog!.close();
      }
    });

    // Pass value selected to category dialog
    categoryNameEl.addEventListener('click', () => {
      if (categoryNameEl.value) {
        // Make the keyword search category name into global
        this.categorySelected = categoryNameEl.value;

        this.renderCategoryList(this.categorySelected);
      }
      this.categoryDialog!.showModal();
    });

    this.closeIcon!.addEventListener('click', () => {
      this.categoryDialog!.close();
    });
  }
}
