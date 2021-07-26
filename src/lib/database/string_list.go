package database

import (
	"database/sql/driver"
	"fmt"
	"reflect"
	"sort"
	"strings"
)

type StringList []string

func NewStringList(list []string) StringList {
	sort.Strings(list)
	return StringList(list)
}

func (list StringList) Value() (driver.Value, error) {
	escapedList := []string{}
	for _, item := range list {
		escapedList = append(escapedList, fmt.Sprintf("\"%s\"", item))
	}
	sort.Strings(escapedList)

	valueStr := fmt.Sprintf("[%s]", strings.Join(escapedList, ","))
	value := []byte(valueStr)

	return value, nil
}

func (list *StringList) Scan(value interface{}) error {
	valueStr := string(value.([]uint8))
	for _, s := range []string{"[", "\"", "]"} {
		valueStr = strings.ReplaceAll(valueStr, s, "")
	}
	countries := []string{}
	if valueStr != "" {
		countries = strings.Split(valueStr, ",")
	}
	*list = StringList(countries)
	return nil
}

// O(log N). List should be sorted ascendentally
func (list StringList) Includes(x string) bool {
	n := len(list)
	i := sort.Search(n, func(i int) bool {
		return (list)[i] >= x
	})
	if i < n && (list)[i] == x {
		return true
	}
	return false
}

func (list StringList) Intersection(another StringList) StringList {
	intersected := []string{}
	for _, candidate := range list {
		if another.Includes(candidate) {
			intersected = append(intersected, candidate)
		}
	}
	return NewStringList(intersected)
}

func (list StringList) Subtract(another StringList) StringList {
	result := []string{}
	for _, candidate := range list {
		if another.Includes(candidate) {
			continue
		}
		result = append(result, candidate)
	}
	return NewStringList(result)
}

func (list StringList) Equal(another StringList) bool {
	return reflect.DeepEqual(list, another)
}
