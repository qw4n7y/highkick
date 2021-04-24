package schedulers

import (
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin/binding"
	"github.com/qw4n7y/highkick/src/models"

	"github.com/gin-gonic/gin"
	repo "github.com/qw4n7y/highkick/src/repo/schedulers"
)

// Destroy .
func Destroy(c *gin.Context) {
	idStr := c.Param("id")
	idInt64, err := strconv.ParseInt(idStr, 10, 64)
	if err != nil {
		panic(err)
	}

	scheduler, err := repo.GetOne(int(idInt64))
	if err != nil {
		panic(err)
	}

	if err := repo.Repo.Destroy(scheduler); err != nil {
		panic(err)
	}

	c.JSON(http.StatusOK, struct{}{})
}

func Index(ctx *gin.Context) {
	schedulers, err := repo.Repo.Get(repo.QueryBuilder{})
	if err != nil {
		panic(err)
	}

	ctx.JSON(http.StatusOK, *schedulers)
}

func Show(ctx *gin.Context) {
	idStr := ctx.Param("id")
	idInt64, err := strconv.ParseInt(idStr, 10, 64)
	if err != nil {
		panic(err)
	}

	scheduler, err := repo.GetOne(int(idInt64))
	if err != nil {
		panic(err)
	}

	ctx.JSON(http.StatusOK, *scheduler)
}

func CreateUpdate(c *gin.Context) {
	var scheduler models.Scheduler
	err := c.ShouldBindBodyWith(&scheduler, binding.JSON)
	if err != nil {
		panic(err)
	}

	if err := repo.Repo.Save(&scheduler); err != nil {
		panic(err)
	}

	c.JSON(http.StatusOK, scheduler)
}
