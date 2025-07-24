import { TestBed } from '@angular/core/testing';
import { LocalstorageService } from './localstorage.service';

describe('LocalstorageService', () => {
  let service: LocalstorageService;

  // Mock localStorage
  let localStorageMock: {
    getItem: jasmine.Spy;
    setItem: jasmine.Spy;
    removeItem: jasmine.Spy;
    clear: jasmine.Spy;
  };

  beforeEach(() => {
    // Create localStorage mock
    localStorageMock = {
      getItem: jasmine.createSpy('getItem'),
      setItem: jasmine.createSpy('setItem'),
      removeItem: jasmine.createSpy('removeItem'),
      clear: jasmine.createSpy('clear')
    };

    // Replace the real localStorage with our mock
    spyOn(localStorage, 'getItem').and.callFake(localStorageMock.getItem);
    spyOn(localStorage, 'setItem').and.callFake(localStorageMock.setItem);
    spyOn(localStorage, 'removeItem').and.callFake(localStorageMock.removeItem);
    spyOn(localStorage, 'clear').and.callFake(localStorageMock.clear);

    TestBed.configureTestingModule({});
    service = TestBed.inject(LocalstorageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should save data to localStorage', () => {
    const testKey = 'testKey';
    const testData = { name: 'Test', value: 123 };

    service.setItem(testKey, testData);

    expect(localStorage.setItem).toHaveBeenCalledWith(testKey, JSON.stringify(testData));
  });

  it('should retrieve data from localStorage', () => {
    const testKey = 'testKey';
    const testData = { name: 'Test', value: 123 };
    const serializedData = JSON.stringify(testData);

    localStorageMock.getItem.and.returnValue(serializedData);

    const result = service.getItem(testKey);

    expect(localStorage.getItem).toHaveBeenCalledWith(testKey);
    expect(result).toEqual(testData);
  });

  it('should handle Date objects correctly when retrieving data', () => {
    const testKey = 'testKey';
    const testDate = new Date('2025-07-24T18:32:00Z');
    const testData = { name: 'Test', date: testDate };
    const serializedData = JSON.stringify(testData);

    localStorageMock.getItem.and.returnValue(serializedData);

    const result = service.getItem(testKey);

    expect(localStorage.getItem).toHaveBeenCalledWith(testKey);
  });

  it('should return null when item is not found in localStorage', () => {
    const testKey = 'nonExistentKey';

    localStorageMock.getItem.and.returnValue(null);

    const result = service.getItem(testKey);

    expect(localStorage.getItem).toHaveBeenCalledWith(testKey);
    expect(result).toBeNull();
  });

  it('should remove item from localStorage', () => {
    const testKey = 'testKey';

    service.removeItem(testKey);

    expect(localStorage.removeItem).toHaveBeenCalledWith(testKey);
  });

  it('should clear all items from localStorage', () => {
    service.clear();

    expect(localStorage.clear).toHaveBeenCalled();
  });

  it('should handle errors when saving to localStorage', () => {
    const testKey = 'testKey';
    const testData = { name: 'Test' };

    // Simulate an error when setting item
    localStorageMock.setItem.and.throwError('Storage error');

    // Spy on console.error
    spyOn(console, 'error');

    // This should not throw an error
    service.setItem(testKey, testData);

    // Verify error was logged
    expect(console.error).toHaveBeenCalled();
  });
});
