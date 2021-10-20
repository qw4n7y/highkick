package workers

import (
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
	"github.com/gin-gonic/gin/binding"
	"github.com/qw4n7y/highkick/src/models"
	repo "github.com/qw4n7y/highkick/src/repo/workers"
)

func Index(ctx *gin.Context) {
	items, err := repo.Repo.Get(repo.QueryBuilder{})
	if err != nil {
		panic(err)
	}

	ctx.JSON(http.StatusOK, *items)
}

func Show(ctx *gin.Context) {
	idStr := ctx.Param("id")
	idInt64, err := strconv.ParseInt(idStr, 10, 64)
	if err != nil {
		panic(err)
	}

	item, err := repo.GetOne(int(idInt64))
	if err != nil {
		panic(err)
	}

	ctx.JSON(http.StatusOK, *item)
}

func CreateUpdate(c *gin.Context) {
	var item models.Worker
	err := c.ShouldBindBodyWith(&item, binding.JSON)
	if err != nil {
		panic(err)
	}

	if err := repo.Repo.Save(&item); err != nil {
		panic(err)
	}

	c.JSON(http.StatusOK, item)
}

// Destroy .
func Destroy(c *gin.Context) {
	idStr := c.Param("id")
	idInt64, err := strconv.ParseInt(idStr, 10, 64)
	if err != nil {
		panic(err)
	}

	item, err := repo.GetOne(int(idInt64))
	if err != nil {
		panic(err)
	}

	if err := repo.Repo.Destroy(item); err != nil {
		panic(err)
	}

	c.JSON(http.StatusOK, struct{}{})
}
