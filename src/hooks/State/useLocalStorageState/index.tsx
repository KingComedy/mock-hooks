import { isBrowser } from '../../../utils';
import { createUseStorageState } from './createUseStorageState';

const useLocalStorageState = createUseStorageState(() => (isBrowser() ? localStorage : undefined));

export default useLocalStorageState;
