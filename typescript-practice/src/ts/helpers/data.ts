import localStorageService from 'services/localStorageService';
import { DataObject, IDataObject, ItemTransaction } from '../global/types';
import { DAY, LOCAL_STORAGE, MONTH } from 'constants/config';
import Transaction from 'models/transaction';
import TransactionDetail from 'models/transactionDetail';
import Category from 'models/category';

export const generateId = (): string => {
  return new Date().getTime().toString();
};

export const convertDataObjectToModel = <T>(dataObj: DataObject<T>): T => {
  const { id } = dataObj;

  return { id, ...dataObj.data } as T;
};

export const convertModelToDataObject = <T>(model: T): DataObject<T> => {
  const { id, ...data } = model as IDataObject<T>;

  return { id, data } as DataObject<T>;
};

/**
 * A function create token for user
 * @returns {string} Return token string
 */
export const createToken = (): string => {
  const lengthToken: number = 36;
  const chars: string =
    'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let token: string = '';
  for (let i: number = 0; i < lengthToken; i += 1) {
    token += chars[Math.floor(Math.random() * chars.length)];
  }
  return token;
};

export const formatNumber = (number: number): string => {
  return number.toLocaleString(undefined, {
    minimumFractionDigits: 2,
  });
};

export const changeDateFormat = (oldFormatDate: string) => {
  const tempDate = new Date(oldFormatDate);

  const day = DAY[tempDate.getDay()];
  const date = tempDate.getDate();
  const month = MONTH[tempDate.getMonth()];
  const year = tempDate.getFullYear();

  return `${day}, ${date}, ${month}, ${year}`;
};

export const clearAccessToken = (): void => {
  localStorageService.remove(LOCAL_STORAGE.ACCESS_TOKEN);
};

export const getAllCategoryNameInTransactions = (
  transactions: Transaction[],
): string[] => {
  const categoryName = new Set();

  transactions.forEach((transaction) =>
    categoryName.add(transaction.categoryName),
  );

  return Array.from(categoryName) as string[];
};

export const getAllTransactionByCategoryName = (
  categoryName: string,
  transactions: Transaction[],
) => {
  const results = transactions.filter((transaction) => {
    return transaction.categoryName === categoryName;
  });

  return results;
};

export const createTransactionDetailObject = (
  category: Category,
  transactions: Transaction[],
): TransactionDetail => {
  const totalTransaction = transactions.length;
  const totalAmount = () => {
    let amount = 0;

    transactions.forEach((transaction) => {
      amount += transaction.amount;
    });

    return amount;
  };
  const listTransaction = (): ItemTransaction[] => {
    const results: ItemTransaction[] = transactions.map((transaction) => {
      const dateParts = changeDateFormat(transaction.date).split(','); // ['Monday', '14', 'September', '2023']
      const day = dateParts[1];
      const fullDateString = `${dateParts[0]}, ${dateParts[2]} ${dateParts[3]}`;
      const tempData: ItemTransaction = {
        id: transaction.id,
        day,
        fullDateString,
        note: transaction.note,
        amount: transaction.amount,
      };

      return tempData;
    });

    results.sort((a, b) => parseInt(b.id) - parseInt(a.id));

    return results;
  };

  return new TransactionDetail(
    category.name,
    category.url,
    totalTransaction,
    totalAmount(),
    listTransaction(),
  );
};
